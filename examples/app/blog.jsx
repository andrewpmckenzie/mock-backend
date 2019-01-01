class Blog extends React.Component {
  constructor() {
    super();

    this.state = {
      loadingMessage: 'Loading...',
      meta: {},
      posts: [],
      postContent: '',
      postTitle: '',
      postError: '',
    };
  }

  componentDidMount() {
    this.loadPosts();
    this.loadMeta();
  }

  loadPosts() {
    this.setState({loadingMessage: 'Loading posts'});
    fetch('/posts')
      .then((r) => r.json())
      .then((posts) => this.setState({posts, loadingMessage: ''}));
  }

  loadMeta() {
    fetch('/meta')
      .then((r) => r.json())
      .then((meta) => this.setState({meta}));
  }

  handleSubmit() {
    const {postContent, postTitle} = this.state;
    this.setState({loadingMessage: 'Posting'});
    fetch('/posts', {method: 'POST', body: {title: postTitle, body: postContent}})
      .then(async (r) => {
        if (r.status !== 200) {
          throw new Error(await r.text());
        }
        this.setState({postContent: '', postTitle: '', postError: ''});
        this.loadPosts()
      })
      .catch((e) => {
        this.setState({loadingMessage: '', postError: e.message});
      });
  }

  renderStyles() {
    return (<style>{`
      @keyframes throb {
          0%   { background-color: #78909C; color: transparent; }
          25%  { background-color: #78909C; color: #FFF;        }
          50%  { background-color: #FFB300; color: transparent; }
          75%  { background-color: #689F38; color: #FFF;        }
          100% { background-color: #78909C; color: transparent; }
      }

      .loading {
        font-family: 'Helvetica Neue', Helvetica, arial, sans-serif;
        animation: 5s throb ease-in-out infinite;
        color: white;
        font-size: 48px;
        bottom: 0;
        left: 0;
        padding-top: 200px;
        position: fixed;
        text-align: center;
        right: 0;
        top: 0;
      }

      .container {
        font-family: 'Helvetica Neue', Helvetica, arial, sans-serif;
        margin: 0 auto;
        max-width: 900px;
      }

      .header {
        font-size: 200%;
        margin: 24px 0;
      }

      .contents {
        display: flex;
      }

      .posts {
        flex-grow: 1;
      }

      .post {

      }

      .post-body {

      }

      .post-title {

      }

      .form {
        display: flex;
        flex-direction: column;
        margin-left: 24px;
        padding-left: 24px;
        width: 300px;
      }

      .form > *:not(h2) {
        border: none;
        background: none;
        font-size: 12px;
        margin-bottom: 24px;
        padding: 8px;
      }

      .form input[type=text],
      .form textarea {
        border-bottom: solid 1px #78909C;
      }

      .form input[type=submit] {
        border: solid 1px #78909C;
        border-radius: 4px;
      }

      .form > input:focus,
      .form > textarea:focus {
        background: #ECEFF1;
        outline: none;
      }

      .form .error {
        color: #C62828;
        margin-top: -12px;
        text-align: center;
      }
    `}</style>);
  }

  renderPost(post, index) {
    return (
      <div key={index} className='post'>
        <h2 className='post-title'>{post.title}</h2>
        <div className='post-body'>{post.body}</div>
      </div>
    )
  }

  renderForm() {
    const {postContent, postTitle, postError} = this.state;
    return (
      <form className='form' onSubmit={(e) => { this.handleSubmit(); e.preventDefault(); }}>
        <h2>Create Post</h2>
        <input name='title'
               required
               placeholder='Title'
               type='text'
               value={postTitle}
               onChange={(e) => this.setState({postTitle: e.target.value})}
               />
        <textarea name='content'
                  required
                  placeholder='Write something...'
                  value={postContent}
                  onChange={(e) => this.setState({postContent: e.target.value})}
                  />
        <input type='submit' />
        {postError ? <div className='error'>{postError}</div> : null}
      </form>
    );
  }

  render() {
    const {posts, loadingMessage, meta} = this.state;

    if (loadingMessage) {
      return (<div>
        {this.renderStyles()}
        <div className='loading'>{loadingMessage}...</div>
      </div>);
    }

    return (
      <div className='container'>
        {this.renderStyles()}
        <h1 className='header'>
          {meta.title || '-'}
        </h1>
        <div className='contents'>
          <div className='posts'>{posts.map((p, i) => this.renderPost(p, i))}</div>
          {meta.canPost ? this.renderForm() : null}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Blog />, document.getElementById('app'));
