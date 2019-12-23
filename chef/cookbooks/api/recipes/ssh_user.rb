#
# Cookbook:: api
# Recipe:: ssh_user<
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
  password '$1$Yh.RZEcI$9xZaWejW6QatNsNnYMouI/'
end

# Add user luka to sudoers group
group "create luka sudo" do
  group_name 'sudo'
  members 'luka'
  action :modify
  append true
end
