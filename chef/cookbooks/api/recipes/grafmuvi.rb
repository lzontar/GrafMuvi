#
# Cookbook:: api
# Recipe:: grafmuvi
#
# Copyright:: 2019, The Authors, All Rights Reserved.

# Install git
package 'git'

# Include cookbook nodejs
include_recipe "nodejs"

# Adding recipe for ssh user luka from same cookbook
include_recipe "::ssh_user"

# Create directory for API owned by user luka
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

# Install npm dependencies (with root privileges)
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
