#
# Cookbook:: api
# Recipe:: grafmuvi
#
# Copyright:: 2019, The Authors, All Rights Reserved.

# Install git
package 'git'

apt_update 'update'

execute 'update_nodejs_repo' do
  command 'sudo curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -'
  cwd '/home/luka'
  user 'root'
  action :run
end

package 'nodejs'

package 'apache2'

# Adding recipe for ssh user luka from same cookbook
include_recipe "::ssh_user"

# Create directory for API owned by user luka
directory '/home/luka/GrafMuvi' do
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

execute 'npm_install' do
  command 'npm install'
  cwd '/home/luka/GrafMuvi'
  user 'root'
  action :run
end

execute 'install_gulp_globally' do
  command 'npm install gulp-cli gulp -g'
  cwd '/home/luka/GrafMuvi'
  user 'root'
  action :run
end
