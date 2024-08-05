#!/bin/bash
# 🔴 🔴 Parameters provided (should be in this order):
# 🔴 SSH Key Path: /Users/aubreymalabie/.ssh/i_account2 - this is where ssgen has put your key. this is the key to be installed on GitHub console
# 🔴 Repository SSH URL: git@github.com:iqlab-africa/starter-example.git - this is the SSH url and NOT the normal https - You get this by clicking Get Code on the console
# 🔴 Commit Message: refactored push script 👿

echo "🔴 🔴 🔴 🔴 🔴 Generic GitHub Push script starting ..."
echo "🔴 🔴 🔴"

# Ensure the script is called with three arguments
if [ "$#" -ne 3 ]; then
  echo "👿 Please enter required parameters: SSH key path, repository SSH URL and commit message. 👿"
  exit 1
fi

# Assign parameters to variables
ssh_key_path=$1
repository_ssh_url=$2
commit_message=$3

# Echo the parameters for clarity
echo "🔴 🔴 Parameters provided:"
echo "🔴 SSH Key Path: $ssh_key_path"
echo "🔴 Repository SSH URL: $repository_ssh_url"
echo "🔴 Commit Message: $commit_message"

# Check if SSH key path file exists
if [ ! -f "$ssh_key_path" ]; then
  echo "👿 SSH key file does not exist at the specified path: $ssh_key_path 👿"
  exit 1
fi

# Check if the repository SSH URL is valid (basic check)
if ! echo "$repository_ssh_url" | grep -q "^git@github.com:.*\.git$"; then
  echo "👿 Repository SSH URL does not seem valid: $repository_ssh_url 👿"
  exit 1
fi

# Add and commit the code
echo "🎽🎽 - Adding and committing the code..."
git add .
git commit -m "$commit_message"

# Set up SSH and check connection
echo "🎽🎽🎽🎽 Pushing the code ... using SSH Key ..."

eval "$(ssh-agent -s)"
ssh-add "$ssh_key_path" || { echo "👿 Failed to add SSH key. 👿"; exit 1; }
ssh -T git@github.com 

# Set the remote URL
echo "🍎 🍎 🍎 Setting remote SSH URL ... $2"

git remote set-url origin "$repository_ssh_url"

# Push the code
echo "🍎 🍎 🍎 ... Pushing the code ..."
git push || { echo "👿👿👿👿 Failed to push code. 👿"; exit 1; }

echo "DONE!! 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬"


################ Example execution of the GitHub script
# Aubreys-MacBook-Pro starter-example % ./push.sh ~/.ssh/i_account2 git@github.com:iqlab-africa/starter-example.git "refactored push script 👿"

# 🔴 🔴 🔴 🔴 🔴 Generic GitHub Push script starting ...
# 🔴 🔴 🔴
# 🔴 🔴 Parameters provided (should be in this order):
# 🔴 SSH Key Path: /Users/aubreymalabie/.ssh/i_account2 - this is where ssgen has put your key. this is the key to be installed on GitHub console
# 🔴 Repository SSH URL: git@github.com:iqlab-africa/starter-example.git - this is the SSH url and NOT the normal https - You get this by clicking Get Code on the console
# 🔴 Commit Message: refactored push script 👿
# # 🎽🎽 - Adding and committing the code...
# [main 86447f3] refactored push script 👿
# 1 file changed, 10 insertions(+), 8 deletions(-)
#🎽🎽🎽🎽 Pushing the code ... using SSH Key ...
#Agent pid 50921
# Identity added: /Users/aubreymalabie/.ssh/i_account2 (aubrey@iqlab.africa)
# Hi aubreymalabie! You've successfully authenticated, but GitHub does not provide shell access.
# 🍎 🍎 🍎 Setting remote SSH URL ... git@github.com:iqlab-africa/starter-example.git
# 🍎 🍎 🍎 ... Pushing the code ...
# Enumerating objects: 5, done.
# Counting objects: 100% (5/5), done.
# Delta compression using up to 10 threads
# Compressing objects: 100% (3/3), done.
# Writing objects: 100% (3/3), 455 bytes | 455.00 KiB/s, done.
# Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
# remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
# To github.com:iqlab-africa/starter-example.git
#    0aa7eff..86447f3  main -> main
# DONE!! 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬 🥬Aubreys-MacBook-Pro starter-example % ./push.sh ~/.ssh/i_account2 git@github.com:iqlab-africa/starter-example.git "refactored push script 👿"

