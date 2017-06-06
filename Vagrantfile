# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/xenial64"

    # ensure this folder is synced by default
    config.vm.synced_folder ".", "/vagrant"

    # set a private ip
    config.vm.network "private_network", ip: "192.168.33.2"

    # ssh settings
    config.ssh.private_key_path = "~/.ssh/id_rsa"
    config.ssh.username = "root"
    config.ssh.forward_agent = true
    config.ssh.insert_key = true

    # copy our public key to the box
    config.vm.provision "shell" do |s|
        ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
        s.inline = <<-SHELL
            echo #{ssh_pub_key} > /home/ubuntu/.ssh/authorized_keys
            echo #{ssh_pub_key} > /root/.ssh/authorized_keys
        SHELL
    end

    # limit the box settings
    config.vm.provider "virtualbox" do |v|
        v.memory = 2048
    end

    # run the provision script
    config.vm.provision "shell", path: "src/Vagrant/provision.sh"
end
