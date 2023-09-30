##
# To use this file, add these two lines at the top of your script:
#
#   SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
#   source ${SCRIPT_DIR}/common.sh
#
##

export REPO_DIR=$(git rev-parse --show-toplevel)

# ANSI color escape code (https://en.wikipedia.org/wiki/ANSI_escape_code#Colors)

# Foreground colors
export FCOLOR_BLACK="\e[30m"
export FCOLOR_RED="\e[31m"
export FCOLOR_GREEN="\e[32m"
export FCOLOR_YELLOW="\e[33m"
export FCOLOR_BLUE="\e[34m"
export FCOLOR_MAGENTA="\e[35m"
export FCOLOR_CYAN="\e[36m"
export FCOLOR_WHITE="\e[37m"
export FCOLOR_GRAY="\e[90m"
export FCOLOR_BRIGHT_RED="\e[91m"
export FCOLOR_BRIGHT_GREEN="\e[92m"
export FCOLOR_BRIGHT_YELLOW="\e[93m"
export FCOLOR_BRIGHT_BLUE="\e[94m"
export FCOLOR_BRIGHT_MAGENTA="\e[95m"
export FCOLOR_BRIGHT_CYAN="\e[96m"
export FCOLOR_BRIGHT_WHITE="\e[97m"
export END_FCOLOR="\e[39m"

# Background colors
export BCOLOR_BLACK="\e[40m"
export BCOLOR_RED="\e[41m"
export BCOLOR_GREEN="\e[42m"
export BCOLOR_YELLOW="\e[43m"
export BCOLOR_BLUE="\e[44m"
export BCOLOR_MAGENTA="\e[45m"
export BCOLOR_CYAN="\e[46m"
export BCOLOR_WHITE="\e[47m"
export BCOLOR_GRAY="\e[100m"
export BCOLOR_BRIGHT_RED="\e[101m"
export BCOLOR_BRIGHT_GREEN="\e[102m"
export BCOLOR_BRIGHT_YELLOW="\e[103m"
export BCOLOR_BRIGHT_BLUE="\e[104m"
export BCOLOR_BRIGHT_MAGENTA="\e[105m"
export BCOLOR_BRIGHT_CYAN="\e[106m"
export BCOLOR_BRIGHT_WHITE="\e[107m"
export END_BCOLOR="\e[39m"

export BOLD="\e[1m"
export END_BOLD="\e[22m"

export ITALIC="\e[3m"
export END_ITALIC="\e[23m"

export UNDERLINE="\e[4m"
export END_UNDERLINE="\e[24m"

export RESET="\e[0m"


info() {
  echo -e "${RESET}${FCOLOR_CYAN}ℹ️  $*${RESET}"
}

warning() {
  echo -e "${RESET}${FCOLOR_YELLOW}🚸 $*${RESET}"
}

error() {
  echo -e "${RESET}${FCOLOR_RED}❌ $*${RESET}"
}

fatal() {
  echo -e "${RESET}${FCOLOR_BRIGHT_RED}${BOLD}💥 $*${RESET}"
  exit 1
}

success() {
  echo -e "${RESET}${FCOLOR_BRIGHT_GREEN}✅ $*${RESET}"
}

failure() {
  echo -e "${RESET}${FCOLOR_BRIGHT_RED}❌ $*${RESET}"
}

##
# Examples:
#
#   info This is an ${ITALIC}informative${END_ITALIC} message
#   warning This is a ${BOLD}warning${END_BOLD} message
#   error This is an ${UNDERLINE}error${END_UNDERLINE} message
#   pass The test ${ITALIC}${BOLD}${UNDERLINE}passed${END_ITALIC}${END_BOLD}${END_UNDERLINE}!
#   fail The test ${ITALIC}${BOLD}${UNDERLINE}failed${END_ITALIC}${END_BOLD}${END_UNDERLINE}!
##
