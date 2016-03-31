# ROADMAP

## Preparation

* [x] **GITHUB** Choose repo (GitHub vs. BitBucket). I prefer GitHub (a lot of integration stuff, **releases**, and other tasty features). Bitbucket has just two advantages : there is one old project, and there are opportunity to use **free private** repositories.
* [x] **NODEJS** Choose platform. My choice - **node.js** (javascript) + sqlite.

## Milestone 1: DataStructure Scaffold

Start date: **2016-02-29**

* [x] application scaffold
    * [x] logging
    * [x] sessions
    * [x] db-integration
    * [x] db-autodeploy
    * [x] db-models scaffold
* [x] desribe data structures for `user`
* [x] authentication
* [x] user management ( #2 ):
    * [x] change password
    * [x] list
    * [x] create
    * [x] disable/enable
* [x] make site menu well-looks ( #3 )

## Milestone 2

* [x] persons ( #4 )
    * [x] data structures
    * [x] link with `user`
    * [x] list persons
    * [x] create person
    * [x] edit person
    * [x] delete person
* [x] builders ( #5 )
    * [x] C builder
    * [x] R builder
    * [x] U builder
    * [x] D builder
    * [x] link persons with builder
* [x] builder's priorities ( #6 )
    * [x] data-field
    * [x] description
    * [x] style

## Milestone 3

* [ ] tenders PART1
    * [x] break ticket apart
    * [ ] data structure
    * [ ] wizard
    * [ ] tender view page
* [ ] authorization
    * [ ] data structure for `roles`
    * [ ] link `user` and `roles`
    * [ ] add tests for user's priveleges in code

## Milestone 4

* [ ] tenders PART2
    * [ ] tender's index page (with division by statuses)
    * [ ] project's file management
    * [ ] link with users
    * [ ] tender's workflow
    * [ ] TODO : finish decomposition...
* [x] **SOLVED** (milestone 2) more style and CSS
