#!/usr/bin/env bash
##!/usr/bin/env zsh

# This file will git pull, npm install, and if needed, build assets. See README "getting setup remotely" for more.

# Function to calculate hash using SHA-512 based on availability
calculate_hash() {
    local dir="$1"
    local hash_command

    if command -v sha512sum >/dev/null 2>&1; then
        hash_command="sha512sum"
    elif command -v shasum >/dev/null 2>&1 && shasum -a 512 /dev/null >/dev/null 2>&1; then
        hash_command="shasum -a 512"
    else
        echo "Error: SHA-512 is not available on your system. Please install 'sha512sum' or 'shasum' to proceed." >&2
        return 1
    fi

    # Calculate hash using the determined command
    find "$dir" -type f -exec $hash_command {} + | awk '{print $1}' | $hash_command
}


# Calculate the old hash of the assets/webpack directories
old_hash=$(calculate_hash "assets")
old_wp_hash=$(calculate_hash "webpack")

# Update repo
if git_pull_output=$(git pull 2>&1); then
    # Check if there were updates from git
    if echo "$git_pull_output" | grep -q 'Already up to date'; then
        echo "No updates from git."
        exit 0
    else
        printf "\nGIT UPDATE\n\n"
        echo "$git_pull_output";
        printf "\nEND GIT\n"

        printf "\nSTART NPM\n"
        # NPM install (we don't bother checking hashes, this might be first-run).
        npm i
        printf "\nEND NPM\n"

        # Calculate new hash of the assets/webpack directories
        new_hash=$(calculate_hash "assets")
        new_wp_hash=$(calculate_hash "webpack")

        # Check if asset folder exists or hash has changed
        if [ ! -d ".tmp/public" ] || [ "$new_hash" != "$old_hash" ] || [ "$new_wp_hash" != "$old_wp_hash" ]; then
            # Execute build process
            printf "\nRUNNING BUILD\n"
            npm run build
            printf "\nFINISHED BUILDING\n"
        else
            printf "\nSKIPPING BUILD\n"
        fi
    fi
else
    printf "\n\nERROR\n\n"
    echo "$git_pull_output";
    printf "\n\nFailed to update the repository. Exiting.\n\n"
    exit 1
fi
