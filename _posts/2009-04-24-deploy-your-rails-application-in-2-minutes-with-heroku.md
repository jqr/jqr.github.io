---
layout: post
title: Deploy Your Rails Application in 2 Minutes with Heroku
summary: The simplest possible application deployment for Rails applications.
---

<p><a href="https://heroku.com/">Heroku</a>, Instant Ruby Platform. We've been using Heroku's free service for hosting staging servers for a few weeks now. It takes just a moment to setup and it couldn't be any easier to use.</p>

<p>Today Heroku announced a <a href="https://heroku.com/pricing">pricing model</a> and we should be using them for more than staging servers in the near future.</p>

<h3>Start the clock</h3>

<p>First timer? You'll need to do some minor setup. The middle command will ask you for your Heroku login/password and upload your SSH pubkey.</p>

```sh
sudo gem install heroku
heroku keys:add
heroku create
```

<p>Heroku installs gem dependencies for your app when you do a git push, so it needs to have a .gems file in an easy to parse format.</p>

<p>Run these commands to install a rake task for automatically generating a .gems file from your Rails gem dependencies. You'll need to rerun the rake task whenever you change your dependencies.</p>

```sh
curl https://gist.github.com/101101.txt > lib/tasks/heroku.rake
rake heroku:gems
git add lib/tasks/heroku.rake .gems
git commit lib/tasks/heroku.rake .gems -m "Adding gem manifest for Heroku."
```

<p>Here we go, push your app, migrate the database and open it in a web browser! </p>

```sh
git push heroku master
heroku rake db:migrate
heroku open
```

<h3>Done</h3>
<p>Your application is up and running on Heroku's servers, 100% ready to use. Check out the next guide on setting up <a href="/2009/04/25/deploying-multiple-environments-on-heroku.html">multiple environments with Heroku</a>.</p>

<h3>Troubleshooting</h3>

<p>If the application had any trouble starting try the commands below to get a better view.</p>

```sh
heroku logs     # view the application logs
heroku open     # some error messages show on the web
```
