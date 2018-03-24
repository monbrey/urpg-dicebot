exports.output = (help, aliases) => {
    return {
        title: `!${help.name}`,
        description: `${help.description}`,
        fields: [{
            name: "Command usage:",
            value: `\`\`\`${help.usage}\`\`\``
        }],
        footer: {
            text: aliases ? `Aliases: !${aliases.join(", !")}` : ''
        }
    }
}