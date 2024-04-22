#!/usr/bin/env bash

# This file will git pull, npm i, and if needed, build assets. See README "getting setup remotely" for more.

# Function to calculate hash using sha256sum or shasum based on availability
calculate_hash() {
    local hash_command

    # Check if sha256sum command is available
    if command -v sha256sum >/dev/null 2>&1; then
        hash_command="sha256sum"
    else
        hash_command="shasum -a 256"
    fi

    # Calculate hash using the determined command
    find assets -type f -exec $hash_command {} + | awk '{print $1}' | $hash_command
}

old_hash=$(calculate_hash)

# Update repo
if git_pull_output=$(git pull 2>&1); then
    # Check if there were updates from git
    if echo "$git_pull_output" | grep -q 'Already up to date'; then
        echo "No updates from git. Exiting."
        exit 0
    else
        # NPM install
        npm i

        # Calculate new hash of asset folder
        new_hash=$(calculate_hash)

        # Check if asset folder exists or hash has changed
        if [ ! -d ".tmp/public" ] || [ "$new_hash" != "$old_hash" ]; then
            echo "Running asset build..."
            # Execute build process
            npm run build
        fi

        exit 0
    fi
else
    echo "Failed to update the repository. Exiting."
    exit 1
fi
