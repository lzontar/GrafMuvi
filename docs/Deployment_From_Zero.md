## :ok_hand: Deployment from zero
In this section we will explain how to deploy our API from zero, i.e. we will complete the following steps to deploy our application to production stage:
- Firstly, we will create a virtual machine using [Vagrant](https://www.vagrantup.com/), which will be provided by [Azure](https://azure.microsoft.com/en-us/),
- After our VM will be created, we will provision it with [Chef](https://www.chef.io/) and thus install all the necessary services to deploy our API
- Lastly, we will deploy our service using [Capistrano](https://capistranorb.com/) and run it on our VM machine so that it will be publicly accessible

### Vagrant
Here we will see the configuration of *Vagrantfile*, which defines the creation of virtual machine and its provision. Before we jump into *Vagrantfile*, we have to first install Vagrant plugin for Azure and add a dummy box.
```
$ vagrant plugin install vagrant-azure
$ vagrant box add azure https://github.com/azure/vagrant-azure/raw/v2.0/dummy.box --provider azure
```
After that we execute: ```vagrant up --provider azure```

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Define VM box. Before that execute: vagrant box add azure https://github.com/azure/vagrant-azure/raw/v2.0/dummy.box --provider azure
  config.vm.box = 'azure'
  config.env.enable
  # SSH user settings
  config.ssh.username = 'luka'
  config.ssh.private_key_path = '~/.ssh/id_rsa'

  config.vm.provider :azure do |azure, override|
    # Azure subscription credentials
    azure.tenant_id = "a6cc90df-f580-49dc-903f-87af5a75338e" #ENV['AZURE_TENANT_ID']
    azure.client_id = "2fc904ef-31b3-4646-a961-ebf68cbee58b" #ENV['AZURE_CLIENT_ID']
    azure.client_secret = "808e8e2d-83ca-4466-9aba-0320c4e1ba81" #ENV['AZURE_CLIENT_SECRET']
    azure.subscription_id = "d43ca18a-4b0e-4fa3-adac-7a8923a20fcf" #ENV['AZURE_SUBSCRIPTION_ID']

    azure.tcp_endpoints = 80

    azure.vm_name = 'grafmuvi' # Set VM name
    azure.vm_size = 'Standard_A1_v2' # Set VM size
    azure.vm_image_urn = 'Canonical:UbuntuServer:18.04-LTS:latest' # Set VM image URN
    azure.resource_group_name = 'grafmuvi' # Set resource group name
    azure.dns_name = 'grafmuvi' # Set DNS name
    azure.location = 'westeurope' # Set location
  end

  config.vm.provision "shell", inline: "printf 'OMDB_KEY=\"" + ENV['OMDB_KEY'] + "\"\nGRAPHENEDB_URL=\"" + ENV['GRAPHENEDB_URL'] + "\"\nGRAPHENEDB_USER=\"" + ENV['GRAPHENEDB_USER'] + "\"\nGRAPHENEDB_PASSWD=\"" + ENV['GRAPHENEDB_PASSWD'] + "\"\nDNS=\"" + ENV['DNS'] + "\"\nPORT=" + ENV['PORT'] + "\nIP=\"" + ENV['IP'] + "\"' > /.env"

  # Declare where chef repository path
  chef_repo_path = "./chef"

  # Provisioning Chef-Zero
  config.vm.provision :chef_zero do |chef|
    # Added necessary chef attributes
    chef.cookbooks_path = 'chef/cookbooks'
    chef.nodes_path = 'chef/cookbooks'

    #### Adding recipes ####
    chef.add_recipe "api::ssh_user"
    chef.add_recipe "api::grafmuvi"

    # Running recipes
    chef.run_list = [
      'recipe[api::ssh_user]',
      'recipe[api::grafmuvi]'
    ]
    # Accept chef license
    chef.arguments = "--chef-license accept"
  end
end
```
In the Vagrantfile, which is defined by the code above, we can see that we could separate it to two parts (if we exclude SSH settings and setting VM box):
- **Creating VM** - here we can see the settings of our VM provided by Azure
  - Define TCP port
  - Set VM name: *grafmuvi*
  - Set VM size: *Standard_A1_v2* (1 CPU, 2GB RAM)
  - Set VM image URN (which defines OS): *Canonical:UbuntuServer:16.04.0-LTS:latest* (UbuntuServer 16.04-LTS)
  - Set resource group which will provide VM in Azure: *grafmuvi*
  - Set Azure DNS name: *grafmuvi*
  - Set location of Azure's VM: *West Europe*
- **Provisioning VM** - in this part we set Chef for provisioning and define how shall it be provisioned
  - Set Chef repository path
  - Define paths for cookbooks and nodes
  - Add recipes that will be executed on created VM
  - Add Chef license

### Chef
Provisioning with Chef is already defined in [docs/Provision.md](https://github.com/lzontar/GrafMuvi/blob/master/docs/Provision.md) but few changes have been made due to version inconsistencies and unnecessary code. Nevertheless, we still keep both of our recipes *ssh_user.rb* and *grafmuvi.rb*.
```
#
# Cookbook:: api
# Recipe:: grafmuvi
#
# Copyright:: 2019, The Authors, All Rights Reserved.

# Install git
package 'git'

# Update packages
apt_update 'update'

# Update Node.js repository
execute 'update_nodejs_repo' do
  command 'sudo curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -'
  cwd '/home/luka'
  user 'root'
  action :run
end

# Install Node.js
package 'nodejs'

# Adding recipe for ssh user luka from same cookbook
include_recipe "::ssh_user"

# Create directory for API owned by user luka
directory '/home/luka/GrafMuvi' do
  owner 'luka'
  mode '0755'
end

# Create directory for production deployment
directory '/home/luka/Apps' do
  owner 'luka'
  mode '0755'
end

# Clone GrafMuvi git repository
git 'GrafMuvi' do
  repository 'https://github.com/lzontar/GrafMuvi'
  user 'luka'
  destination '/home/luka/GrafMuvi'
  action :checkout
end

# Install NPM dependecies
execute 'npm_install' do
  command 'npm install'
  cwd '/home/luka/GrafMuvi'
  user 'root'
  action :run
end

# Install gulp globally
execute 'install_gulp_globally' do
  command 'npm install gulp-cli gulp -g'
  cwd '/home/luka/GrafMuvi'
  user 'root'
  action :run
end

# Install package nginx
package 'nginx'

execute 'listen_port_80' do
  command 'sudo printf "server {
  listen 80;
  server_name grafmuvi.westeurope.cloudapp.azure.com;
  location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection \'upgrade\';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
   }
}" > /etc/nginx/conf.d/grafmuvi.conf'
  user 'root'
  action :run
end

execute 'restart_nginx' do
  command 'sudo service nginx restart'
  user 'root'
  action :run
end
```
In recipe *grafmuvi.rb* we do the following:
- Install git
- Update packages
- Update Node.js repository and install Node.js
- Include recipe *ssh_user.rb*
- Create directories /home/luka/GrafMuvi (where we will checkout our repo) and /home/luka/Apps (where we will have our production deployments)
- Clone GrafMuvi repository
- Install NPM dependencies
- Install gulp globally
- Lastly we install Nginx proxy so that our API (running on port 4000 by default) will be accessible globally without needing to specify ports (listening at port 80)

```
# Create home dir for new user
directory '/home/luka' do
  action :create
end

# Create user luka
user 'luka' do
  comment 'GrafMuvi user'
  shell '/bin/bash'
  home '/home/luka'
  password '$1$Yh.RZEcI$9xZaWejW6QatNsNnYMouI/'
end

# Add user luka to sudoers group
group "create luka sudo" do
  group_name 'sudo'
  members 'luka'
  action :modify
  append true
end
```
In recipe *ssh_user.rb* we do the following:
- Create home directory for user *luka*
- Create user *luka*
- Add user *luka* to sudoers group

### Capistrano
*Capistrano* is a remote server automation tool, meaning that it can be used to reliably deploy web application to any number of remote servers simultaneously. Even though it is written in Ruby, it can deploy application written in other programming languages. To add Capistrano to our project we have to run:
```
$ cap install
```
After running the command above, we have created multiple files:
```
| -- config
|    | -- deploy
|    |    | -- production.rb
|    |    ` -- staging.rb
|    `-- deploy.rb
` -- Capfile
```
#### Capfile
```
# Load NPM for Capistrano
require 'capistrano-npm'

# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Load the SCM plugin appropriate to your project:
#
# require "capistrano/scm/hg"
# install_plugin Capistrano::SCM::Hg
# or
# require "capistrano/scm/svn"
# install_plugin Capistrano::SCM::Svn
# or
require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git


# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }
```
In *Capfile* we only define requirements of our deployment (gems that we are using). Besides the default ones, we have to require *capistrano-npm*.

#### deploy.rb
```
# config valid for current version and patch releases of Capistrano
lock "~> 3.11.2"

require 'capistrano-gulp'

# Stages
set :stages, ["staging", "production"]
set :default_stage, "production"

# GitHub repo
set :application, "GrafMuvi"
set :repo_url, "git@github.com:lzontar/GrafMuvi.git"

#
set :deploy_to, "/home/luka/Apps/#{fetch :application}"

# Shared folders
set :linked_dirs, %w(
  node_modules
  appData
)

set :linked_dirs, fetch(:linked_dirs) + %w{data}

# Set user
set :user, "luka"

namespace :deploy do
  # Install dependencies
  desc 'Install node modules'
  task :install_node_modules do
    on roles(:app) do
      within release_path do
      #execute "cd #{deploy_to}/current"
        execute :npm, 'install', '-s'
      end
    end
  end

  # Copy environmental variables and data folder required for running the server
  task :copy_env_vars_and_data do
    on roles(:app) do
      within release_path do
        execute "cp /.env #{deploy_to}/current && cp /home/luka/GrafMuvi/appData/* #{deploy_to}/shared/appData"
      end
    end
  end

  # Start server
  task :gulp_start do
    on roles(:app) do
      within release_path do
        as 'root' do
          execute "cd #{deploy_to}/current && npm install gulp && gulp start &"
        end
      end
    end
  end
  after :publishing, :install_node_modules
  after :install_node_modules, :copy_env_vars_and_data
  after :copy_env_vars_and_data, :gulp_start
end
```
In *deploy.rb* we configure the main settings of our deployment:
- Set stages (production and staging, the latter is not used and will thus not be discussed)
- Set application name and the corresponding GitHub repository
- Set deployment directory and user
- Choose directories that will be shared between releases
- During deploy: install node modules, copy .env, appData folders and start the server

#### production.rb
```
role :app, %w{grafmuvi.westeurope.cloudapp.azure.com}

server "grafmuvi.westeurope.cloudapp.azure.com", user: "luka", roles: %w{app}
```
Here we set role and server for production deployment. Roles can be useful, because we could specify tasks for roles, where each role can be configuring different servers.
#### Deployment with Capistrano
Because Capistrano needs several other Ruby gems, we will also create a *Gemfile*:
```
source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.
com/lzontar/GrafMuvi" }

gem 'capistrano', '~> 3.1.0'
gem 'capistrano-npm'
gem 'capistrano-gulp'
```
To install all the necessary gems we have to run:
```
$ bundle install
```
Now that we have our Capistrano files configured and the necessary gems installed, we can deploy our API with Capistrano. We do that by executing:
```
$ cap production deploy
```
**Deployment from zero with task manager**: Because deployment from zero can be a time-consuming task, we want to automate it as much as possible. This is why it is also included in automation with task manager. Using *Gulp* you can easily deploy GrafMuvi API by executing:
```
$ gulp deploy-from-zero
```
It executes: ```vagrant up --no-provision && vagrant provision && cap production deploy```

**Production deployment with task manager**: Furthermore we will include production deployment with *Capistrano* into task manager. Using *Gulp* you can easily make a production deployment by execution:
```
$ gulp production-deploy
```
It executes: ```cap production deploy```
