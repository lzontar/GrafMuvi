# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = 'azure'

  config.ssh.username = 'luka'
  config.ssh.private_key_path = '~/.ssh/id_rsa'

  config.vm.provider :azure do |azure, override|
    # each of the below values will default to use the env vars named as below if not specified explicitly
    azure.tenant_id = ENV['AZURE_TENANT_ID']
    azure.client_id = ENV['AZURE_CLIENT_ID']
    azure.client_secret = ENV['AZURE_CLIENT_SECRET']
    azure.subscription_id = ENV['AZURE_SUBSCRIPTION_ID']

    azure.vm_name = 'grafmuvi'
    azure.vm_size = 'Standard_A1_v2'
    azure.vm_image_urn = 'Canonical:UbuntuServer:16.04.0-LTS:latest'
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
