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

  config.vm.provision "shell", inline: "printf 'OMDB_KEY=\"" + ENV['OMDB_KEY'] + "\"\n
  GRAPHENEDB_URL=\"" + ENV['GRAPHENEDB_URL'] + "\"\n
  GRAPHENEDB_USER=\"" + ENV['GRAPHENEDB_USER'] + "\"\n
  GRAPHENEDB_PASSWD=\"" + ENV['GRAPHENEDB_PASSWD'] + "\"\nDNS=\"" + ENV['DNS'] + "\"\n
  PORT=" + ENV['PORT'] + "\n
  IP=\"" + ENV['IP'] + "\"' > /.env"

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
