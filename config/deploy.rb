# config valid for current version and patch releases of Capistrano
lock "~> 3.11.2"

set :stages, ["staging", "production"]
set :default_stage, "production"

set :application, "GrafMuvi"
set :repo_url, "git@github.com:lzontar/GrafMuvi.git"

set :deploy_to, "/home/me/Applications/#{fetch :application}"

set :linked_dirs, %w(
  node_modules
)

set :user, "luka"

namespace :deploy do
  desc 'Install node modules'
  task :install_node_modules do
    on roles(:app) do
      within release_path do
        execute :npm, 'install', '-s'
      end
    end
  end
end
