// The container for accessing user information

class User {

  // The factory method - it needs to be awaited!
  static async create(username) {
    const user = new User(username);

    // Get the data in parallel
    await Promise.all([
      user.getComments(),
      user.getPosts(),
      user.getAbout()
    ]);

    return user;
  }


  // Do not use this! Use the 'create' factory method instead.
  constructor(username) {
    this.username = username;
  }


  // Internal method for downloading recent comments
  async getComments() {
    const limit = 100;

    const url = `https://www.reddit.com/user/${this.username}/comments.json?limit=${limit}`;
    const response = await getJson(url);
    this.comments = response.data.children.map(child => child.data);

    this.commentBodies = this.comments.map(comment => comment.body);
  }


  // Internal method for downloading recent posts
  async getPosts() {
    const limit = 100;

    const url = `https://www.reddit.com/user/${this.username}/submitted.json?limit=${limit}`;
    const response = await getJson(url);
    this.posts = response.data.children.map(child => child.data);

    // Make sure that the post bodies are from self-posts, i.e. posts that
    // are Reddit topics, instead of outside links.
    this.postBodies = this.posts.filter(post => post.is_self).map(post => post.selftext);

    // For now include the URL in link posts as comment bodies.
    this.postBodies = this.postBodies.concat(this.posts.filter(post => !post.is_self).map(post => post.url));
  }


  // Internal method for downloading the about info
  async getAbout() {
    const url = `https://www.reddit.com/user/${this.username}/about.json`;
    const response = await getJson(url);

    if (response.error === 404) {
      this.about = {};
    }
    else {
      this.about = response.data;
    }
  }

  get isShill() {
    return this.score > 0.5;
  }
}
