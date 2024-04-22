#!/bin/bash

# This file is used to start things inside of TMUX. See README "getting setup remotely" for more.

# In-case you need to make sure script is run from a root user (or `sudo`), uncomment the following:
#if [[ $EUID -ne 0 ]]; then
#    echo "Script MUST be run as a root user"
#    exit 1
#fi

session="bg-apps"
logs_dir=~/tmux-logs

mkdir -p "$logs_dir"

##################################
# This is the function to change #
##################################
function start_something {
    name="$1"

    case "$name" in
        # Define the different types of commands to trigger inside of the TMUX session here.
        # This allows you to start multiple things in tmux in their own window.
        #
        # `myapp` is the default, which is set below this function. Change it here, change it there.

        myapp)
            # A lot of the time (especially on Amazon Linux) you need sudo to open a port on 80 / 443.
            # You MIGHT need to remove sudo for your usage; but usually won't hurt anything.
            run_in_window "$name" "./self-update.sh && sudo npm run lift:prod"
            ;;
        *)
            echo "Unrecognized command: $1"
    esac
}
##################################
# END                            #
##################################

if [ "$1" = "" ]; then
########################################################
# Edit this for the default command to start in TMUX.  #
########################################################
    # Set the default command to run here (name from case statement in start_something function)
    cmd="myapp"
########################################################
# END EDIT AREA                                        #
########################################################
else
    cmd="$1"
fi

function run_in_window {
    name="$1"
    cmd="$2"
    if window_is_open "$name"; then
        echo "Already running: $name"
    else
        echo "Starting: $name"
        echo "Started at $(date)" >  $logs_dir/$name.log
        echo "Command: $cmd"      >> $logs_dir/$name.log
        echo "-------"            >> $logs_dir/$name.log
        # Create new window and run command.
        tmux new-window -t "$session" -n "$name"

        # Check if in BASH, if not, start BASH
        # When this script is run via cron, it doesn't initiate BASH (on some systems), this fixes that.
#        tmux send-keys -t "$session:$name" "if [ -z \$BASH ]; then bash; fi" C-m                           # Should not be needed, but MIGHT be.

        # Or, for zsh users:
#        tmux send-keys -t "$session:$name" "if [ -z \$ZSH_NAME ]; then zsh; fi" C-m                        # Should not be needed, but MIGHT be.
        tmux send-keys -t "$session:$name" "$cmd" C-m
    fi
}

function stop_something {
    name="$1"

    if window_is_open "$name"; then
        echo "Stopping: $name"
#        tmux send-keys -t "$session:$name" C-c
        tmux kill-window -t "$session:$name"
    else
        echo "Not running: $name"
    fi
}

function window_is_open {
    name="$1"

    if (tmux list-windows -t "$session" -F '#{window_name}' | grep "^$name\$" > /dev/null); then
        return 0
    else
        return 1
    fi
}

# Start session if it doesn't exist
if (tmux has-session -t "$session" 2> /dev/null); then
    echo "Session $session exists."
else
    echo "Starting session $session."
    # tmux doesn't allow nested sessions, and if this situation is not caught here then the
    # 'tmux new-session' command will fail.  Although, since the session is being started
    # detached (in most cases), it is probably okay.  So maybe it would be better to just temporarily unset the
    # TMUX variable before running new-session... w/e this prevents problems...
    if [ "$TMUX" != "" ]; then
        echo "Error: cannot start session from within tmux."
        exit 1
    fi
    tmux new-session -d -s "$session" "bash"
fi

# This section handles the different commands, like start / stop / restart / status.
case "$2" in
    status)
        if window_is_open "$cmd"; then
            echo "$cmd appears to be running"
        else
            echo "$cmd is not running"
        fi
        ;;
    stop)
        stop_something "$cmd"
        ;;
    restart)
        stop_something "$cmd"

        i=0
        while window_is_open "$cmd"; do
            if [ $i -gt 10 ]; then
                echo "Taking too long, force-quiting"
                tmux kill-window -t "$session:$cmd"
                break
            else
                echo "Window still open, waiting..."
                sleep 2
                ((i++))
            fi
        done

        start_something "$cmd"
        ;;
    *) # aka "start"
        start_something "$cmd"
esac
