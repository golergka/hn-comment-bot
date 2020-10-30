# hn-comment-bot

This is a bot that will notify you about all replies on [Hacker News](https://news.ycombinator.com). It is available in Telegram at [@hnCommentBot](https://t.me/hnCommentBot).

## How to use

Use /subscribe command with your username, to subscribe to new comment replies to your posts and comments. For example, if your Hacker News username is `pg`, you can subscribe to all new replies with `/subcribe pg`.

Other commands supported atm are `/subscriptions` and `/unsubscribe`.

## Development

Bot uses Postgres 12, and the current schema dump is available at [schema.sql](schema.sql) (generated with [dump.sh](dump.sh)). I will probably move to use proper database migration tool soon.

## Feedback and contributions

All feedback or suggestions are welcome in Github issues, and repository is open for PRs.