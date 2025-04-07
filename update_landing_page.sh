#!/bin/bash

# Function to replace AfriLearn with AfriLearnHub at a specific line
update_line() {
  line_number=$1
  sed -i "${line_number}s/AfriLearn/AfriLearnHub/g" client/src/pages/landing-page.tsx
}

# Lines to update based on grep result
update_line 135
update_line 173
update_line 292 
update_line 342
update_line 367
update_line 397
update_line 428
update_line 640

# Make the script executable
chmod +x update_landing_page.sh
# Run the script
./update_landing_page.sh
