# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/xenial64"

    config.vm.synced_folder "./", "/var/www/upload-bro-bot"

    config.vm.network "private_network", ip: "192.168.33.10"

    config.vm.provision "shell" do |s|
        ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
        s.inline = <<-SHELL
            echo #{ssh_pub_key} > /home/ubuntu/.ssh/authorized_keys
            echo #{ssh_pub_key} > /root/.ssh/authorized_keys
        SHELL
    end

    config.vm.provision "shell", path: "src/Vagrant/provision.sh"
end
