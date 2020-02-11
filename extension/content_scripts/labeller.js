// This will catch Reddit events to find newly loaded comments/posts, and
// label the users accordingly
async function handleRedditEvent(event) {
  const type = event.detail.type;
  const data = event.detail.data;
  const target = event.target;

  if (type == 'postAuthor' || type == 'commentAuthor') {

    // If there is no badge attached yet
    if (target.childElementCount == 0) {

      // We create a 'loading' badge. Aside from giving the user a better
      // experience, it is necessary to create some placeholder badge to allow
      // the above condition to prevent any other badges being added while
      // we wait for a response.
      const badge = document.createElement('button');

      badge.onclick = function() {
        // Send a request to open a tab with the user analysis page
        browser.runtime.sendMessage({
          type: 'userAnalysis',
          username: data.author
        });
      }

      badge.classList.add('badge', 'badge-loading');
      badge.innerHTML = 'Loading';
      target.appendChild(badge);

      // Send a request for user's score
      const score = await browser.runtime.sendMessage({
        type: 'userScore',
        username: data.author
      });

      // Change the badge based on the received score
      if (score > 0.9) {
        badge.classList.replace('badge-loading', 'badge-shill');
        badge.innerHTML = 'Shill';
      } else {
        badge.classList.replace('badge-loading', 'badge-chill');
        badge.innerHTML = 'Chill';
      }
    }
  }
}

document.addEventListener('reddit', handleRedditEvent, true);
document.dispatchEvent(new Event('reddit.ready'));
