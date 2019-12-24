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
