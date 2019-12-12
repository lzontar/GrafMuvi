#
# Cookbook:: api
# Recipe:: npm_dependencies
#
# Copyright:: 2019, The Authors, All Rights Reserved.

# Create home dir for new user
directory '/home/luka' do
  action :create
end

# Create user luka
user 'luka' do
  comment 'GrafMuvi user'
  shell '/bin/bash'
  home '/home/luka'
end

# Authorize ssh key for user luka
ssh_authorize_key 'luka@localhost' do
  key 'AAAAB3NzaC1yc2EAAAADAQABAAABAQDQcWxjhCasf5ugXhUIc5+Izx6qHjNXBNIX2ThEtIOx9qBecMOsE9bTprQDp855kRT9rZbtp5DtILWx6MHlNg/1E9PCMvIdoyeDwwmeYmC2SfGV4h0CO5pgGzxeDeaO9c8DRSHWfwbOhUFqkK+bwBidHUbJaKzDnRv9lmiQKpTtE5YElTS0nIsCJnvy8sZUkAU152tnKg6zQzXwE9DrS9+04rKWRzfIMUN86mdqBQCpf2fJJ75nr1cDZQbcksbgxWPNKTXpSahQJdAiuPkDahWDGRqjzSLMMIJDYkSBsxdx51bUpZ7xWiC24Ji7fw5vXoQ2AX4jtuHEW4AybMb6Z9+3'
  user 'luka'
end

# Add user luka to sudoers group
group "create luka sudo" do
  group_name 'sudo'
  members 'luka'
  action :modify
  append true
end
