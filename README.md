# stonks_bot
Telegram bot project to record incomes and outcomes using google apps scripts 
and spreadsheets. It's also currently working as a journal, to-do and shopping 
list.

Basically uses google apps script as the "backend" for the bot. I send the bot 
a message specifying the change in the cashflow and google apps script stores 
the data in a spreadsheet. 

A couple of functions are triggered once a day and every month. The first one 
shows the outcome of the day. The second one creates a new sheet every month 
and a new spreadsheet file in new year's eve.

## On the installation

### _grosso modo_
First things first: create the telegram bot using the botfather. Keep the 
telegram bot id.

1. Create a drive folder.
2. set the manual project properties.
3. run `launching()`.
4. deploy the bot.
5. use the get functions, set the telegram bot webhook. See `doGet()` in 
`telegram_handler.js`.
6. enjoy the bot.

### Properties
There are two types of properties for this project: the 
ones that you'll net to set up mannually and the ones that 
are automatically generated.

#### Manually config
You need to set up those variables before the first time you may try or deploy 
or deploy the bot.

+ folder_id. the folder where all the generated files will be stored
+ telegram_token. bot token
+ admins. list of admins' telegram id separated by commas.
+ passphrase. passphrase for the get functions

#### Automatically generated
All this variables are created with the `launching` function.
+ ctrl_id. id associated to the ctrl spreadsheet.
+ curr_stonks_ss_ptr. 
+ curr_journl_ss_ptr. 
+ curr_s_ptr. 
+ income_ptr. 
+ outcome_ptr. 
+ shoplist_ptr. 
+ shopcntr_ptr. 
+ journal_ptr. 
+ food_ptr. 
+ todo_ptr. 
+ todo_cntr. 
+ beeper_ss_id. 
+ shoplist_s_name.

#### Verbosity

We need to state clear that there is one user property which handles 
the verbosity: `verbosity`. This can be manually set.

## notes
I used [clasp](https://github.com/google/clasp) to push/pull the changes 
into/from the google apps script project.

## ideas
+ [x] Add triggers to keep the user informed
+ [x] verbosity levels (use reactions and inline features)
+ [ ] ~edit messages -> edit data~
+ [ ] Compute some useful statistics and cool graphs for every day/month/year.
+ [ ] Improve auth.
+ [ ] Create a multiuser support.
+ [ ] Email statisctis to specific email addreeses (supervisors).
+ [x] Shopping list with time-based reminders.
+ [ ] Alarm system (setting triggers)
+ [x] inline keyboard

## Disclaimer
This is a personal project, yet. Feel free to use it or learn from it if 
you find it useful. However there's no straightforward way to launch the 
project if you have no prior experience with telegram bots or google apps 
script. Maybe in the next few months I'll make a tutorial on how to install it.
