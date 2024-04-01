RED='\033[0;31m'
NC='\033[0m'
BWhite='\033[1;37m'
Green='\033[0;32m'
refresh=0

clear
if [ $(wc -c < "customizable/appstate.json") -eq 0 ]; then
  echo -e "${RED}Appstate.json is empty${NC}"
  echo -e "Follow these steps to fix this:"
  echo ""
  echo -e "1. Download this file: ${BWhite}https://replit.com/@$REPL_OWNER/$REPL_SLUG#emergency/c3c-fbstate-1.4.zip${NC}"
  echo -e "2. Extract it."
  echo -e "3. If you're using Chrome, go to ${BWhite}chrome://extensions/${NC}"
  echo -e "   If you're using edge, go to ${BWhite}edge://extensions/${NC}"
  echo -e "4. Turn on the developer mode."
  echo -e "5. Click ${Green}'Load Unpacked'${NC}"
  echo -e "6. Choose the ${Green}'c3c-fbstate-1.4'${NC}"
  echo -e "7. Log-in to ${BWhite}https://web.facebook.com/?_rdc=1&_rdr${NC}"
  echo -e "8. Click the ${Green}'extensions'${NC} and click ${Green}'C3C FBState Utility'${NC}"
  echo -e "9. Click ${Green}'Export FBState'${NC} and ${Green}'Copy to clipboard'${NC}"
  echo -e "Go to ${BWhite}https://replit.com/@$REPL_OWNER/$REPL_SLUG#customizable/appstate.json${NC}"
  echo -e "Paste the FBState, and you're all set!"
else
 while true; do export refresh=$(($refresh+1)); node main.js; done
fi