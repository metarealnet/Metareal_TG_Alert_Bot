# Metareal Internal Telegram Bot

<p align="center"><img src="./front_pic.jpg" width="50%" height="50%"><p>

> ## Overview
>> Language: Javascript
>>
>> This project will provide live updates and signals for the crypto market through a Telegram bot deployed on AWS EC2. 
>> Amazon Elastic Compute Cloud (Amazon EC2) provides scalable computing capacity in the Amazon Web Services (AWS) Cloud.
>>
>> Before starting, get a Telegram bot from **BotFather**, start the bot, and get the bot API.
>>
>> To get a specific chatID, use query: ```https://api.telegram.org/botYOUR_API_KEY/getUpdates```
>
>
> ## AWS Set Up
> 
> 1. **SSH**
> 
>> We want to use a remote virtual machine to run our code, and here we will access the EC2 VM through SSH(Secure Shell Protocol), 
>> which allows remote login and command-line execution
>> Start an EC2 instance (free-tier is good) on AWS, and download pem key.
>> 
>> I'm using type t2.micro with gp2 and 8GiB.
>>
>> SSH Command Example:
>> ```ssh -i "Directory to Metareal.pem" ec2-user@ec2-18-117-194-41.us-east-2.compute.amazonaws.com```
>
> 2. **Install Node and its C dependency**
> 
>> ```sudo yum install -y gcc-c++ make```
>>
>> ```curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -```
>>
>> ```sudo yum install -y nodejs```
>
> 3. **Install Git for Github**
> 
>> ```sudo yum install -y git```
>>
>> Clone this project to the vm: ```git clone ...```
>
>
> 4. **Crontab**
>>
>> Crontab is used to schedule task for the vm so that the vm could run script even when we are logged out.
>>
>> To check existing crontab job: ```crontab -e```; to edit crontab job: ```crontab -l```.
>>
>> Crontab uses format: ```mm HH DD MM WW CMD``` for minute of day, hour of day, day, month, day of week (```*``` for any) followed by your command.
>> 
>> For example: say we want to execte our script at 8AM NYC and save the log file accordingly (cd to working dir first if you have file system dependencies).
>>
>> ```0 8 * * * cd path_to_working_dir && path_to_node path_to_script >> path_to_log_file```
>>
>> (You might want to change the timezone for the vm)




