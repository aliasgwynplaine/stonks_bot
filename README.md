# stonks_bot
Telegram bot project to record incomes and outcomes using google apps scripts and spreadsheets.

Basically uses google apps script as the "backend" for the bot. I send the bot a message 
specifying the change in the cashflow and google apps script stores the data in a 
spreadsheet. 

A couple of functions are triggered once a day and every month. The first one shows the 
outcome of the day. The second one creates a new sheet every month and a new spreadsheet 
file in new year's eve.

## notes
I used [clasp](https://github.com/google/clasp) to push/pull the changes into/from 
the google apps script project.

## ideas
+ [x] Add triggers to keep the user informed
+ [ ] verbosity levels (use reactions and inline features)
+ [ ] edit messages -> edit data
+ [ ] Compute some useful statistics and cool graphs for every day/month/year.
+ [ ] Improve auth.
+ [ ] Create a multiuser support.
+ [ ] Email statisctis to specific email addreeses (supervisors).

## Disclaimer
This is a personal project, yet. Feel free to use it or learn from it if you find it useful. 
However there's no straightforward way to launch the project if you have no prior experience 
with telegram bots or google apps script. Maybe in the next few months I'll make a tutorial 
on how to install it.
