## :sunrise_over_mountains: How do we ensure stable environment?
Provisioning is one of the key elements of continuous delivery process. Lots of bugs and errors do not originate from the code we provide, but are in fact a consequence of the differences in environments. *Docker* ensures stable environment by installing dependencies and libraries. Provisioning goes one step further and thus ensures the same OS, tools that are required to run the project, dependencies and libraries.

We will be using [Vagrant](https://www.vagrantup.com/) to create our VM, which we will use for provisioning with [Chef](https://www.chef.io/). Both tools are open-source and are supported in Windows. For the operating system of our VM we chose Ubuntu 16.04 LTS (Xenial Xerus), which was chosen because it is the latest stable version of Ubuntu, which supports nodejs cookbook from chef (in the latest version Ubuntu 18.04 LTS (Bionic Beaver) it doesn't work).

### Vagrant
Creating VM with Vagrant and using it for provisioning is defined in *Vagrantfile*:
```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Set name of VM
  config.vm.define "GrafMuvi"

  # Choose OS of VM
  config.vm.box = "ubuntu/xenial64"
  config.vm.box_url = "https://vagrantcloud.com/ubuntu/xenial64"

  # Forwarding ports from guest to host
  config.vm.network "forwarded_port", guest: 8080, host: 8082

  # Setting VM provides and VM settings
  config.vm.provider "virtualbox" do |vb|
     # Customize the amount of memory on the VM:
     vb.memory = "2048"
     vb.cpus = 2
  end

  # Declare where chef repository path
  chef_repo_path = "./chef"

  # Provisioning
  config.vm.provision :chef_zero do |chef|
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
In Vagrant file we do the following:
- Set name of VM to *GrafMuvi*
- Set VM box to *ubuntu/bionic64* (and its URL)
- Set forward port on which API is running on VM (8080) to host port (8082)
- Set VM settings provider and its settings (memory, CPU)
- Provisioning with Chef

To create an image we have to run ```gulp vm```, which executes ```vagrant up --no-provision```. To start provisioning we have to run ```gulp provision```, which executes ```vagrant provision``` on our newly created VM. After VM is created and provisioning done, we can run ```vagrant ssh``` to connect to the newly created machine.

### Chef
As we've seen in the Vagrantfile, we are using Chef for provisioning. We have to define a cookbook (in our case: *api*), which can hold multiple recipes (in our case it holds recipes: *grafmuvi* and *ssh_user*). Recipe *ssh_user* is defined in *./chef/cookbook/api/recipes/ssh_user.rb*:
```
directory '/home/luka' do
  action :create
end

# Create user luka
user 'luka' do
  comment 'GrafMuvi user'
  shell '/bin/bash'
  home '/home/luka'
end

# Authorize ssh key
ssh_authorize_key 'luka@localhost' do
  key 'AAAAB3NzaC1yc2EAAAADAQABAAABAQDQcWxjhCasf5ugXhUIc5+Izx6qHjNXBNIX2ThEtIOx9qBecMOsE9bTprQDp855kRT9rZbtp5DtILWx6MHlNg/...
  user 'luka'
end

# Add user luka to sudoers group
group "create luka sudo" do
  group_name 'sudo'
  members 'luka'
  action :modify
  append true
end

```
In recipe *ssh_user* we do the following:
- Create home directory for user
- Create user luka
- Add ssh key for user luka to to authorized keys list
- Add user luka to sudoers group

Recipe *grafmuvi* is defined in *./chef/cookbook/api/recipes/grafmuvi.rb*:

```
# Install git
package 'git'

# Include cookbook nodejs
include_recipe "nodejs"

# Adding ssh user luka
include_recipe "::ssh_user"

# Create directory for API
directory 'GrafMuvi' do
  owner 'luka'
  mode '0755'
end


# Clone GrafMuvi git repository
git 'GrafMuvi' do
  repository 'https://github.com/lzontar/GrafMuvi'
  user 'luka'
  destination 'GrafMuvi'
  action :checkout
end

# Install npm dependencies
npm_package 'package.json modules' do
  path 'GrafMuvi' # The root path to your project, containing a package.json file
  json true
  user 'root'
end

# Install globally gulp
npm_package 'gulp-cli' do
  path 'GrafMuvi'
  user 'root'
  options ['-g']
end

# Install globally pm2
npm_package 'pm2' do
  path 'GrafMuvi'
  user 'root'
  options ['-g']
end
```
In recipe *grafmuvi* we do the following:
- Install *git* package so that we will be able to clone our repo
- Include *nodejs* cookbook and recipe *ssh_user* from our cookbook *api*
- Create directory */GrafMuvi* where we will clone our repo
- Clone git repository
- Install npm dependencies
- Install *gulp*  and *pm2* so that we will be able to use them globally

In *./chef/cookbooks/api/Policyfile.rb* of our cookbook we have to define dependencies of our cookbook:
```
cookbook 'nodejs', '~> 6.0.0', :supermarket
cookbook 'ssh_authorized_keys', '~> 0.4.0', :supermarket
```
And we have to declare that our cookbook depends on other cookbooks in *./chef/cookbooks/api/metadata.rb*
```
depends 'nodejs'
depends 'ssh_authorized_keys'
```
To successfully run provisioning we have to install our dependencies by running:
```
chef install ./chef/cookbooks/api/Policyfile.rb
```

Now we can connect to our VM to newly created user luka using ssh (port is forwarded to host port 2222) by running:
```
$ ssh luka@localhost -p 2222
```

### VagrantCloud
Furthermore, we uploaded the image of our VM to [VagrantCloud](https://app.vagrantup.com/). After creating a repository on *VagrantCloud*, we have to package our VM:
```
$ vagrant package --output GrafMuvi.box
```
Now we have to upload our VM image to *VagrantCloud*.

Our VM image is deployed to VagrantCloud: *[lukaz/grafmuvi-VM](https://app.vagrantup.com/lukaz/boxes/grafmuvi)*
