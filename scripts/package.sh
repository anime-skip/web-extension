#!/bin/bash
set -e
source ./.env

ESC="\x1b"
RESET="$ESC[0m"
BOLD="$ESC[1m"
DIM="$ESC[2m"
RED="$ESC[91m"
GREEN="$ESC[92m"
BLUE="$ESC[94m"
TEAL="$ESC[96m"
CODE="$BOLD$TEAL"

title() {
    echo -e "\n${BOLD}${BLUE}$1${RESET}"
}

step() {
    echo -e "${DIM} - ${RESET}$1${RESET}"
}

run() {
    step "$1"
    echo -e "##### $1 #####\n" | sed 's/\x1B\[[0-9;]\+[A-Za-z]//g' >> "$LOG_FILE"
    eval "$2 2>&1 >> '$LOG_FILE'"
    echo -e "\n" >> "$LOG_FILE"
}

onFailure() {
    echo ""
    echo -e "${BOLD}${RED}Packaging failed...${RESET}"
    echo ""
    exit 1
}
trap 'onFailure' ERR


# SETUP ################################

PACKAGE_VERSION=$(node -e 'console.log(require("./package.json").version)')
PACKAGE_NAME=$(node -e 'console.log(require("./package.json").name)')
OUTPUT_DIRECTORY="artifacts"
LOG_DIRECTORY="$OUTPUT_DIRECTORY/logs"
LOG_FILE="$LOG_DIRECTORY/$(date '+%Y-%m-%d_%H-%M-%S').log"
OUTPUT_NAME="$OUTPUT_DIRECTORY/$PACKAGE_NAME-$PACKAGE_VERSION"

echo -e "\n${BOLD}Packaging Web Extension${RESET}"

title   "Build Info"
echo -e "  ${DIM}PACKAGE_VERSION:  ${RESET}${BOLD}$PACKAGE_VERSION${RESET}"
echo -e "  ${DIM}PACKAGE_NAME:     ${RESET}${BOLD}$PACKAGE_NAME${RESET}"
echo -e "  ${DIM}OUTPUT_DIRECTORY: ${RESET}${BOLD}$OUTPUT_DIRECTORY${RESET}"
echo -e "  ${DIM}LOG_DIRECTORY:    ${RESET}${BOLD}$LOG_DIRECTORY${RESET}"
echo -e "  ${DIM}LOG_FILE:         ${RESET}${BOLD}$LOG_FILE${RESET}"
echo -e "  ${DIM}OUTPUT_NAME:      ${RESET}${BOLD}$OUTPUT_NAME${RESET}"


# CLEANUP ##############################

title "Prepare Output Directories"
mkdir -p "$LOG_DIRECTORY" # Don't use 'run' since it depends on this directory

run "rm ${CODE}dist"            "rm -rf 'dist'"
run "rm ${CODE}$OUTPUT_NAME/*"  "rm -rf '$OUTPUT_NAME'"
run "mkdir ${CODE}$OUTPUT_NAME" "mkdir -p '$OUTPUT_NAME'"


# PREPACKAGE ###########################

title "Pre-package"

run "Install dependencies"  "yarn install"
run "Check for type errors" "yarn compile"
run "Check formatting"      "yarn prettier"
run "Lint"                  "yarn lint"
run "Run Tests"             "yarn test"
run "Run Integration Tests" "yarn test:integration"
run "Run E2E Tests"         "yarn test:e2e"
run "Verify manifest"       "yarn check-manifest"


# PACKAGE ##############################

title "Packaging Artifacts"

# All
# TODO - Create source.zip

# Firefox
run "Building for ${CODE}firefox" "yarn build:prod"
run "Create ${CODE}firefox.zip" "(cd dist && zip -r '$OUTPUT_NAME/firefox.zip' .)"

# Chrome
run "Building for ${CODE}chrome" "yarn build:chrome:prod"
run "Create ${CODE}chrome.zip" "(cd dist && zip -r '$OUTPUT_NAME/chrome.zip' .)"


# DEPLOY ###############################

title "Deploying"

# Firefox
run "Signing and uploading ${CODE}firefox.xpi" "yarn web-ext --config=.web-ext.config.js sign -a '$OUTPUT_NAME' -n 'firefox.xpi' --api-key '$FIREFOX_SIGNING_ISSUER' --api-secret '$FIREFOX_SIGNING_SECRET' --id='$FIREFOX_SIGNING_ID'"
mv "$OUTPUT_NAME/anime_skip-$PACKAGE_VERSION-an+fx.xpi" "$OUTPUT_NAME/firefox.xpi"

# Chrome
run "Submit ${CODE}chrome.zip${RESET} for review" "./scripts/chrome-publish.sh '$OUTPUT_NAME/chrome.zip' 2>&1"

# All
run "Create and push ${CODE}v$PACKAGE_VERSION${RESET} tag" "git tag 'v$PACKAGE_VERSION' && git push --tags &> /dev/null"


# CLEANUP ##############################

echo ""
echo -e "${BOLD}${GREEN}Done!${RESET}"
echo ""
exit 0
