role :app, %w{luka@grafmuvi.westeurope.cloudapp.azure.com}

# Role db is not used because our database on production and deployment is currently still the same
# Role db will support migrating between releases
# role :db, %w{database.com}

server "grafmuvi.westeurope.cloudapp.azure.com", user: "luka", roles: %w{app}
