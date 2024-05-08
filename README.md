# Income inspection

Static site that presents some basic data on your income growth and other wealth metrics.

Deployed through Cloudflare Pages [here](salary-snapshot.pages.dev/).

## Data

Data is from SCB.

| Data                                                                                             | Link                                                                                                        |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Genomsnittlig månadslön och lönespridning efter sektor, yrke (SSYK 2012) och kön. År 2014 - 2022 | [Link](https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0110__AM0110A/LoneSpridSektorYrk4A/) |
| Genomsnittlig månadslön och lönespridning efter sektor, yrke (SSYK) och kön. År 2005 - 2013      | [Link](https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0110__AM0110A/LoneSpridSektorYrk4/)  |
| Konsumentprisindex (KPI), totalt, 1980=100. Månad 1980M01 - 2024M03                              | [Link](https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__PR__PR0101__PR0101A/KPItotM/)              |

To fetch and map the data I have a ETL pipeline to fetch the income data form SCB and then transform it and save it in the `/public` folder.

I have a cron job that fetches the data once a month. This can also be done manually on the dev machine or in a pipeline in github.
