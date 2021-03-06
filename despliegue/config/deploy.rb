# config valid for current version and patch releases of Capistrano
lock "~> 3.11.2"

require 'capistrano-gulp'

# Stages
set :stages, ["production"]
set :default_stage, "production"

# GitHub repo
set :application, "GrafMuvi"
set :repo_url, "git@github.com:lzontar/GrafMuvi.git"
set :branch, "master"

# Folder where our API will be deployed to
set :deploy_to, "/home/luka/Apps/#{fetch :application}"

# Shared folders
set :linked_dirs, %w(
  node_modules
)

set :linked_dirs, fetch(:linked_dirs) + %w{data}

# Set user
set :user, "luka"

namespace :deploy do
  # Install dependencies
  desc 'Install node modules'
  task :install_node_modules do
    on roles(:app) do
      within release_path do
      #execute "cd #{deploy_to}/current"
        execute :npm, 'install', '-s'
      end
    end
  end

  # Copy environmental variables and data folder required for running the server
  task :copy_env_vars_and_data do
    on roles(:app) do
      within release_path do
        execute "cp /.env #{deploy_to}/current && cp -r #{deploy_to}/current/appData #{deploy_to}/shared/"
      end
    end
  end

  # Start server
  task :gulp_start do
    on roles(:app) do
      within release_path do
        as 'root' do
          execute "cd #{deploy_to}/current && sudo npm install -g gulp && sudo npm -g install pm2 && gulp start"
        end
      end
    end
  end
  after :publishing, :install_node_modules
  after :install_node_modules, :copy_env_vars_and_data
  after :copy_env_vars_and_data, :gulp_start
end
