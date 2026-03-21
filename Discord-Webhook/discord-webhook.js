keyboard = require("keyboard");
display = require("display");
wifi = require("wifi");

const webhook = "https://discordapp.com/api/webhooks/your/webhook/here";
const color_blue = display.color(115, 138, 219);
const color_dark_blue = display.color(69, 95, 201);

var exitApp = false;
var message = "<empty>";
var new_message = "";
var selCursor = 1;

display.setCursor(0, 20);

if (!wifi.connected()) {
  display.fill(color_blue);
  display.setTextSize(1);
  display.drawText("Not connected to Wi-Fi!");
  delay(2000);
  exitApp = true;
}

function drawMenu() {
  display.fill(color_blue);
  display.setTextColor(0xFFFF, 0xFFFF);

  display.setTextSize(3);
  display.drawText("Discord", 90, 20);

  if (selCursor == 1) display.drawFillRect(25, 65, 250, 25, color_dark_blue);
  else if (selCursor == 2) display.drawFillRect(25, 95, 250, 25, color_dark_blue);
  else if (selCursor == 3) display.drawFillRect(25, 125, 250, 25, color_dark_blue);

  display.setTextSize(2);
  display.drawText("Change message", 30, 70);
  display.drawText("Send webhook message", 30, 100);
  display.drawText("Help", 30, 130);
}

drawMenu();

while (!exitApp) {
  if (keyboard.getEscPress()) break;

  if (keyboard.getNextPress()) {
    selCursor = selCursor < 3 ? selCursor + 1 : 1;
    drawMenu();
  } else if (keyboard.getPrevPress()) {
    selCursor = selCursor > 1 ? selCursor - 1 : 3;
    drawMenu();
  }

  if (keyboard.getSelPress()) {
    if (selCursor == 1) {
      new_message = keyboard.keyboard();
      if (new_message != "") {
        message = new_message;
      }
    } else if (selCursor == 2) {
      wifi.httpFetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      });
      display.fill(color_blue);
      display.setTextSize(2);
      display.drawText("Sent!", 50, 80);
      delay(1000);
    } else if (selCursor == 3) {
      display.fill(color_blue);
      display.setTextSize(2);
      display.drawText("How to set webhook:", 0, 0);
      display.setTextSize(1);
      display.drawText("To change the webhook, edit this javascript file,", 0, 20);
      display.drawText("and edit the 'webhook' variable to ur Discord webhook.", 0, 30);
      display.drawText("Make sure you are connected to internet, and ur", 0, 40);
      display.drawText("webhook is valid.", 0, 50);
      display.drawText("Press any key to close this page.", 0, 75);

      while (!keyboard.getAnyPress()) {
        // Refresh on input
      }
    }
    drawMenu();
  }

  delay(50);
}

display.fill(0);
