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
