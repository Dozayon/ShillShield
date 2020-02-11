// If the button was clicked
document.getElementById("moderation").onclick = function () {
  // Create a tab with the moderator interface
  browser.tabs.create({
    active: true,
    url: "/moderation/moderation.html"
  })
  .then(tab => {
    // Close the pop-up once the tab is loaded
    window.close();
  });
}


// If the dataset button was clicked
document.getElementById('dataset').onclick = function () {
  browser.runtime.sendMessage({ type: 'dataset' });
}
