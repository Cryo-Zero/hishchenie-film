# Synthetic review seed

REVIVAL R2 currently includes 10 synthetic database users used only to show and test a populated review feed.
They are marked in `auth.users.raw_user_meta_data` with:

`seed = revival_r2_demo`

Deleting those marked auth users cascades to their profiles, reviews, replies and likes and does not touch real users.

The seed intentionally includes a few examples of strong language so the optional browser-side lexicon filter can be tested.
