---
layout: post
title: Global Git Ignore
summary: Keeping your repositories clean.
---
OS X has this file that creeps into any directory you browse called <a href="http://en.wikipedia.org/wiki/.DS_Store">.DS_Store</a>. All too often this file will accidentally get committed to a repository.

Every time I setup a new git project, I end up adding .DS_Store to the .gitignore file. This ensures no one will accidentally commit this unimportant file.

Git supports global ignores just like any good SCM.

```sh
$ git config --global core.excludesfile ~/.gitignore
$ printf ".DS_Store\nThumbs.db\n" >> ~/.gitignore
```


For good measure I threw in Windows' creepy file <a href="http://en.wikipedia.org/wiki/Thumbs.db">Thumbs.db</a>.

Sadly this won't stop other developers from accidentally committing those files, so you still need to add those ignores to your .gitignore in every project. I've setup my <a href="https://github.com/jqr/dotfiles/blob/master/bash_profile.d/git.sh">git init alias</a> to do this for me.
