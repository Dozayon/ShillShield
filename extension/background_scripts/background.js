// A map from username to User promise
let userPromises = new Map();

function getUserPromise(username) {
  // If the user hasn't had a promise created yet, create one first.
  if (!userPromises.has(username))
    userPromises.set(username, User.create(username));

  return userPromises.get(username);
}

function handleRequest(request) {
  if (request.type == 'userScore') {
    return getUserPromise(request.username).then(user => user.score);
  }
  else if (request.type == 'userAnalysis') {
    browser.tabs.create({
      active: true,
      url: browser.extension.getURL(`analysis/analysis.html?u=${request.username}`)
    });
  }
  else if (request.type == 'userDetail') {
    return getUserPromise(request.username).then(user => user.detail);
  }
}

browser.runtime.onMessage.addListener(handleRequest);
