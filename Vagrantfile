# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'vagrant-azure'


Vagrant.configure("2") do |config|
  # Set name of VM to GrafMuvi
  #config.vm.define "GrafMuvi"

  # Set OS of VM to Ubuntu 16.04 LTS (Xenial Xerus)
  #config.vm.box = "ubuntu/xenial64"
  #config.vm.box_url = "https://vagrantcloud.com/ubuntu/xenial64"

  # UNCOMMENT FOR TESTING API RUNNING ON VAGRANT VM PROVISIONED BY CHEF
  # Forwarding ports from guest (8080) to host (8082)
  # config.vm.network "forwarded_port", guest: 8080, host: 8082

  config.vm.box = 'cloud_azure'
#  config.vm.box_url = 'https://github.com/azure/vagrant-azure/raw/master/dummy.box'

#  config.vm.network "private_network", guest: 80, host: 80, ip: "192.168.50.10"
  config.ssh.username = 'luka'
  config.ssh.private_key_path = '~/.ssh/id_rsa'

  # config.vm.synced_folder '.', '/vagrant', :disabled => true

  config.vm.provider :azure do |azure, override|
    # each of the below values will default to use the env vars named as below if not specified explicitly
    azure.tenant_id = "a6cc90df-f580-49dc-903f-87af5a75338e" #ENV['AZURE_TENANT_ID']
    azure.client_id = "2fc904ef-31b3-4646-a961-ebf68cbee58b" #ENV['AZURE_CLIENT_ID']
    azure.client_secret = "808e8e2d-83ca-4466-9aba-0320c4e1ba81"
    azure.subscription_id = "d43ca18a-4b0e-4fa3-adac-7a8923a20fcf" #ENV['AZURE_SUBSCRIPTION_ID']

    azure.tcp_endpoints = '80'

    config.vm.box_check_update = false

    azure.vm_name = 'grafmuvi'
    azure.vm_size = 'Standard_A1_v2'
    azure.vm_image_urn = 'canonical:ubuntuserver:16.04.0-LTS:latest'
    azure.resource_group_name = 'grafmuvi'
    azure.dns_name = 'grafmuvi'
    azure.location = 'westeurope'
  end

  # Declare where chef repository path
  chef_repo_path = "./chef"

  # Provisioning Chef-Zero
  config.vm.provision :chef_zero do |chef|
    # Added necessary chef attributes
    chef.cookbooks_path = 'chef/cookbooks'
    chef.nodes_path = 'chef/cookbooks'

    # UNCOMMENT FOR TESTING API RUNNING ON VAGRANT VM PROVISIONED BY CHEF
    # chef.binary_env = LIST OF ENVIRONMENT VARIABLES
    # chef.binary_env = "OMDB_KEY='99d69c21' GRAPHENEDB_URL='bolt://hobby-opoodnimkkgogbkeelldpadl.dbs.graphenedb.com:24787' GRAPHENEDB_USER='app149042785-7w3PaA' GRAPHENEDB_PASSWD='b.SDGFhDPxK7kf.WUfwSEc3OOBlnvV3' DNS='https://2ec26f6a5f61480599c3568c6e362569@sentry.io/1784355'"

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
