// ═══════════════════════════════════════════════════════════════
//  TimeCraft Discord Bot - Server Template Setup
//  Lance le bot, tape /setup dans ton serveur Discord
// ═══════════════════════════════════════════════════════════════

const {
    Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder,
    EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder,
    ButtonBuilder, ButtonStyle, StringSelectMenuBuilder
} = require('discord.js');
try { require('dotenv').config(); } catch (_) {}

// ══════════ CONFIG ══════════
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MC_API_KEY = process.env.MC_API_KEY || 'timecraft-secret-key';
const API_PORT = process.env.PORT || process.env.API_PORT || 3050;
if (!TOKEN || !CLIENT_ID) {
    console.error('❌ Variables manquantes ! Définis DISCORD_TOKEN et CLIENT_ID.');
    console.error('   Exemple : DISCORD_TOKEN=ton_token CLIENT_ID=ton_id node index.js');
    process.exit(1);
}
// ════════════════════════════

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE DEFINITION
// ═══════════════════════════════════════════════════════════════

const COLORS = {
    gold: 0xFFAA00,
    red: 0xFF4444,
    green: 0x44FF44,
    blue: 0x4488FF,
    purple: 0xAA44FF,
    cyan: 0x44FFFF,
    dark: 0x2B2D31,
    orange: 0xFF8800,
    pink: 0xFF66AA,
};

// ── Rôles à créer (du plus bas au plus haut) ──
const ROLES = [
    { name: '─────── Niveaux ───────', color: 0x2B2D31, hoist: false, separator: true },
    { name: '⏳ Débutant',           color: 0xAAAAAA, hoist: true },
    { name: '⌛ Apprenti',           color: 0x55FF55, hoist: true },
    { name: '🕐 Chroniqueur',        color: 0x5555FF, hoist: true },
    { name: '🕑 Maître du Temps',    color: 0xAA00AA, hoist: true },
    { name: '🕛 Légende Temporelle', color: 0xFFAA00, hoist: true },
    { name: '─────── Prestige ───────', color: 0x2B2D31, hoist: false, separator: true },
    { name: '⭐ Prestige I',         color: 0xFFFF55, hoist: true },
    { name: '⭐⭐ Prestige II',      color: 0xFF8800, hoist: true },
    { name: '⭐⭐⭐ Prestige III',   color: 0xFF4444, hoist: true },
    { name: '💎 Prestige IV',        color: 0x44FFFF, hoist: true },
    { name: '👑 Prestige V',         color: 0xFF55FF, hoist: true },
    { name: '─────── Spécial ───────', color: 0x2B2D31, hoist: false, separator: true },
    { name: '🏆 Champion',           color: 0xFFD700, hoist: true },
    { name: '🎮 Joueur',             color: 0x3498DB, hoist: true },
    { name: '🔔 Notifications',      color: 0x99AAB5, hoist: false },
    { name: '─────── Staff ───────',  color: 0x2B2D31, hoist: false, separator: true },
    { name: '👑 Fondateur',          color: 0xFF0000, hoist: true, permissions: [PermissionFlagsBits.Administrator] },
    { name: '🛡️ Admin',              color: 0xFF4444, hoist: true, permissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers] },
    { name: '⚔️ Modérateur',         color: 0xFF8800, hoist: true, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.MuteMembers] },
    { name: '🤖 Bot',                color: 0x7289DA, hoist: true },
];

// ── Catégories et salons ──
const CATEGORIES = [
    {
        name: '📋 ─ INFORMATIONS',
        channels: [
            { name: '👋┃bienvenue',       type: 'text', readonly: true },
            { name: '📚┃règles',           type: 'text', readonly: true },
            { name: '📢┃annonces',         type: 'text', readonly: true },
            { name: '🔔┃changelog',        type: 'text', readonly: true },
            { name: '🗳️┃sondages',         type: 'text', readonly: true },
        ]
    },
    {
        name: '⏰ ─ TIMECRAFT',
        channels: [
            { name: '💬┃chat-général',     type: 'text' },
            { name: '📊┃classement',       type: 'text', readonly: true },
            { name: '🏆┃hall-of-fame',     type: 'text', readonly: true },
            { name: '🎯┃stratégies',       type: 'text' },
            { name: '🎬┃clips-et-screens', type: 'text' },
            { name: '🎉┃events',           type: 'text', readonly: true },
        ]
    },
    {
        name: '💡 ─ COMMUNAUTÉ',
        channels: [
            { name: '💬┃discussion',       type: 'text' },
            { name: '🤣┃memes',            type: 'text' },
            { name: '🎵┃musique',          type: 'text' },
            { name: '🎮┃autres-jeux',      type: 'text' },
            { name: '🤖┃commandes-bot',    type: 'text' },
        ]
    },
    {
        name: '🎤 ─ VOCAL',
        channels: [
            { name: '🎮 Général',          type: 'voice' },
            { name: '⏰ TimeCraft #1',     type: 'voice' },
            { name: '⏰ TimeCraft #2',     type: 'voice' },
            { name: '🎵 Musique',          type: 'voice' },
            { name: '🔇 AFK',              type: 'voice' },
        ]
    },
    {
        name: '💼 ─ SUPPORT',
        channels: [
            { name: '❓┃faq',              type: 'text', readonly: true },
            { name: '🎫┃ouvrir-ticket',    type: 'text' },
            { name: '💡┃suggestions',      type: 'text' },
            { name: '🐛┃bug-report',       type: 'text' },
        ]
    },
    {
        name: '🔒 ─ STAFF',
        staffOnly: true,
        channels: [
            { name: '📋┃staff-chat',       type: 'text' },
            { name: '📝┃logs',             type: 'text' },
            { name: '⚙️┃config-bot',       type: 'text' },
            { name: '🔊 Staff Vocal',      type: 'voice' },
        ]
    },
];

// ═══════════════════════════════════════════════════════════════
//  MINECRAFT DATA CACHE — Reçu du plugin par HTTP POST
// ═══════════════════════════════════════════════════════════════

const http = require('http');

let mcData = null;         // Dernières données reçues du plugin
let mcDataTimestamp = 0;   // Timestamp de la dernière réception

function startAPIReceiver() {
    const server = http.createServer((req, res) => {
        if (req.method === 'POST' && req.url === '/api/push') {
            // Vérifier le token
            const auth = req.headers['authorization'];
            if (!auth || auth !== `Bearer ${MC_API_KEY}`) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end('{"error":"Unauthorized"}');
                return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    mcData = JSON.parse(body);
                    mcDataTimestamp = Date.now();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end('{"ok":true}');
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end('{"error":"Invalid JSON"}');
                }
            });
        } else if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'ok',
                hasData: mcData !== null,
                lastUpdate: mcDataTimestamp ? new Date(mcDataTimestamp).toISOString() : null,
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end('{"error":"Not found"}');
        }
    });

    server.listen(API_PORT, () => {
        console.log(`📡 Récepteur API démarré sur le port ${API_PORT}`);
    });
}

function isMcDataFresh() {
    return mcData !== null && (Date.now() - mcDataTimestamp) < 120_000; // 2 min max
}

// ═══════════════════════════════════════════════════════════════
//  SLASH COMMANDS REGISTRATION
// ═══════════════════════════════════════════════════════════════

async function registerCommands() {
    const rest = new REST().setToken(TOKEN);
    const commands = [
        new SlashCommandBuilder()
            .setName('setup')
            .setDescription('🏗️ Crée le template complet du serveur TimeCraft')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('welcome')
            .setDescription('📨 Envoie le message de bienvenue dans le salon actuel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('rules')
            .setDescription('📚 Envoie les règles dans le salon actuel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('faq')
            .setDescription('❓ Envoie la FAQ dans le salon actuel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('info')
            .setDescription('📋 Envoie les infos du serveur MC dans le salon actuel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('📊 Affiche le classement en temps réel depuis le serveur MC'),
        new SlashCommandBuilder()
            .setName('ticket')
            .setDescription('🎫 Envoie le panneau de tickets dans le salon actuel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('stats')
            .setDescription('📈 Affiche les stats d\'un joueur')
            .addStringOption(opt =>
                opt.setName('joueur')
                    .setDescription('Nom du joueur Minecraft')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('online')
            .setDescription('🟢 Affiche les joueurs en ligne sur le serveur'),
        new SlashCommandBuilder()
            .setName('serveur')
            .setDescription('🖥️ Affiche le statut du serveur Minecraft'),
        new SlashCommandBuilder()
            .setName('autoleaderboard')
            .setDescription('📊 Active la mise à jour auto du classement dans ce salon (toutes les 2 min)')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ].map(cmd => cmd.toJSON());

    // Enregistrer sur chaque guilde (instantané) au lieu de global (jusqu'à 1h)
    for (const guild of client.guilds.cache.values()) {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), { body: commands });
    }
    console.log('✅ Commandes slash enregistrées !');
}

// ═══════════════════════════════════════════════════════════════
//  SETUP - CRÉE TOUT LE SERVEUR
// ═══════════════════════════════════════════════════════════════

async function setupServer(interaction) {
    const guild = interaction.guild;
    
    try {
        await interaction.reply({ content: '⏳ **Création du template en cours...**\nCela peut prendre quelques secondes.', ephemeral: true });
    } catch (e) {
        console.error('❌ Impossible de répondre à l\'interaction:', e.message);
        return;
    }

    const createdRoles = {};

    // ── 1. Créer les rôles ──
    console.log('📌 Création des rôles...');
    for (const roleDef of ROLES) {
        try {
            const existing = guild.roles.cache.find(r => r.name === roleDef.name);
            if (existing) {
                createdRoles[roleDef.name] = existing;
                continue;
            }
            const perms = roleDef.permissions
                ? roleDef.permissions.reduce((a, b) => a | b, 0n)
                : 0n;

            const role = await guild.roles.create({
                name: roleDef.name,
                color: roleDef.color,
                hoist: roleDef.hoist || false,
                permissions: perms,
                mentionable: false,
            });
            createdRoles[roleDef.name] = role;
            console.log(`  ✅ Rôle créé : ${roleDef.name}`);
        } catch (e) {
            console.error(`  ❌ Erreur rôle ${roleDef.name}:`, e.message);
        }
    }

    // ── 2. Créer les catégories et salons ──
    console.log('📌 Création des salons...');
    const staffRoles = [
        createdRoles['👑 Fondateur'],
        createdRoles['🛡️ Admin'],
        createdRoles['⚔️ Modérateur'],
    ].filter(Boolean);

    for (const catDef of CATEGORIES) {
        try {
            // Créer la catégorie
            const permOverwrites = [];

            if (catDef.staffOnly) {
                permOverwrites.push({
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                });
                for (const staffRole of staffRoles) {
                    permOverwrites.push({
                        id: staffRole.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    });
                }
                // Bots aussi
                if (createdRoles['🤖 Bot']) {
                    permOverwrites.push({
                        id: createdRoles['🤖 Bot'].id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    });
                }
            }

            const category = await guild.channels.create({
                name: catDef.name,
                type: ChannelType.GuildCategory,
                permissionOverwrites: permOverwrites,
            });
            console.log(`  📁 Catégorie : ${catDef.name}`);

            // Créer les salons
            for (const chDef of catDef.channels) {
                const chOverwrites = [];

                if (chDef.readonly && !catDef.staffOnly) {
                    chOverwrites.push({
                        id: guild.id,
                        deny: [PermissionFlagsBits.SendMessages],
                    });
                    for (const staffRole of staffRoles) {
                        chOverwrites.push({
                            id: staffRole.id,
                            allow: [PermissionFlagsBits.SendMessages],
                        });
                    }
                    if (createdRoles['🤖 Bot']) {
                        chOverwrites.push({
                            id: createdRoles['🤖 Bot'].id,
                            allow: [PermissionFlagsBits.SendMessages],
                        });
                    }
                }

                const chType = chDef.type === 'voice'
                    ? ChannelType.GuildVoice
                    : ChannelType.GuildText;

                await guild.channels.create({
                    name: chDef.name,
                    type: chType,
                    parent: category.id,
                    permissionOverwrites: chOverwrites.length > 0 ? chOverwrites : undefined,
                });
                console.log(`    #️⃣  ${chDef.name}`);
            }
        } catch (e) {
            console.error(`  ❌ Erreur catégorie ${catDef.name}:`, e.message);
        }
    }

    // ── 3. Configurer l'icône du serveur (optionnel) ──
    try {
        await guild.setName('⏰ TimeCraft');
    } catch (e) {
        console.log('  ⚠️ Impossible de renommer le serveur');
    }

    await interaction.editReply({
        content: '✅ **Template TimeCraft créé avec succès !**\n\n'
            + '📌 **Prochaines étapes :**\n'
            + '> • Utilise `/welcome` dans <#bienvenue>\n'
            + '> • Utilise `/rules` dans <#règles>\n'
            + '> • Utilise `/faq` dans <#faq>\n'
            + '> • Utilise `/info` dans <#annonces>\n'
            + '> • Utilise `/leaderboard` dans <#classement>\n'
            + '> • Tu peux supprimer les anciens salons',
    });

    console.log('\n🎉 Setup terminé !');
}

// ═══════════════════════════════════════════════════════════════
//  EMBEDS - MESSAGES RICHES
// ═══════════════════════════════════════════════════════════════

function buildWelcomeEmbeds() {
    const banner = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle('⏰  BIENVENUE SUR TIMECRAFT  ⏰')
        .setDescription(
            '```\n' +
            '╔══════════════════════════════════════╗\n' +
            '║     ⏰  T I M E C R A F T  ⏰       ║\n' +
            '║   Le temps est ta seule monnaie.     ║\n' +
            '╚══════════════════════════════════════╝\n' +
            '```'
        )
        .setThumbnail('https://mc-heads.net/head/MHF_Clock')
        .addFields(
            {
                name: '🎮 __Concept__',
                value:
                    '> Tu démarres avec **1 heure** de temps.\n' +
                    '> Chaque seconde, ton chrono **descend**.\n' +
                    '> **Tue des joueurs** → +10 min\n' +
                    '> **Tue des mobs** → +2 min\n' +
                    '> **Temps = 0** → Éliminé en spectateur\n' +
                    '> Achète des items au **shop PNJ** avec ton temps !',
            },
            {
                name: '⚡ __Fonctionnalités__',
                value:
                    '```\n' +
                    '🏆 Système de niveaux et prestiges\n' +
                    '🎲 Événements aléatoires en jeu\n' +
                    '💀 Malus de mort et AFK\n' +
                    '🛒 Shop avec le temps comme monnaie\n' +
                    '📊 Classement en temps réel\n' +
                    '🔒 Zone de spawn protégée\n' +
                    '```',
            },
            {
                name: '🚀 __Rejoindre__',
                value:
                    '**Version :** `1.21`\n' +
                    '**Statut :** 🟢 En ligne 24/7\n' +
                    '**IP :** *Bientôt disponible !*',
            }
        )
        .setImage('https://i.imgur.com/placeholder.png') // Remplace par ta bannière
        .setFooter({ text: 'TimeCraft • Le temps est précieux' })
        .setTimestamp();

    const rolesEmbed = new EmbedBuilder()
        .setColor(COLORS.purple)
        .setTitle('🎭  RÔLES DISPONIBLES')
        .setDescription(
            '**Niveaux en jeu** (automatiques) :\n' +
            '> ⏳ Débutant → ⌛ Apprenti → 🕐 Chroniqueur\n' +
            '> 🕑 Maître du Temps → 🕛 Légende Temporelle\n\n' +
            '**Prestiges** (automatiques) :\n' +
            '> ⭐ → ⭐⭐ → ⭐⭐⭐ → 💎 → 👑\n\n' +
            '**Spéciaux** :\n' +
            '> 🏆 Champion — Record du serveur\n' +
            '> 🔔 Notifications — Reçois les pings events'
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('role_notif')
            .setLabel('🔔 Notifications')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('role_joueur')
            .setLabel('🎮 Joueur')
            .setStyle(ButtonStyle.Primary),
    );

    return { embeds: [banner, rolesEmbed], components: [row] };
}

function buildRulesEmbeds() {
    const rules = new EmbedBuilder()
        .setColor(COLORS.red)
        .setTitle('📚  RÈGLES DU SERVEUR')
        .setDescription('*En rejoignant le serveur, tu acceptes ces règles.*')
        .addFields(
            {
                name: '⚔️ __Règles Minecraft__',
                value:
                    '```\n' +
                    '1. ❌ Pas de hack/cheat/xray\n' +
                    '2. ❌ Pas d\'exploit ou duplication\n' +
                    '3. ❌ Pas de camp AFK abusif\n' +
                    '4. ❌ Pas de spawn kill (zone protégée)\n' +
                    '5. ✅ PvP autorisé partout hors spawn\n' +
                    '6. ✅ Alliances temporaires ok\n' +
                    '7. ✅ Trashtalking léger ok\n' +
                    '```',
            },
            {
                name: '💬 __Règles Discord__',
                value:
                    '```\n' +
                    '1. ❌ Pas d\'insultes, harcèlement, racisme\n' +
                    '2. ❌ Pas de spam ou flood\n' +
                    '3. ❌ Pas de pub non autorisée\n' +
                    '4. ❌ Pas de contenu NSFW\n' +
                    '5. ❌ Pas de doxxing ou infos perso\n' +
                    '6. ✅ Respect mutuel entre joueurs\n' +
                    '7. ✅ Utilise les bons salons\n' +
                    '```',
            },
            {
                name: '⚠️ __Sanctions__',
                value:
                    '> **1ère offense** → Avertissement\n' +
                    '> **2ème offense** → Mute 24h\n' +
                    '> **3ème offense** → Ban temporaire (7j)\n' +
                    '> **Triche/Hack** → Ban permanent',
            }
        )
        .setFooter({ text: '⏰ TimeCraft — Les règles s\'appliquent à tous' });

    return { embeds: [rules] };
}

function buildFaqEmbeds() {
    const faq = new EmbedBuilder()
        .setColor(COLORS.cyan)
        .setTitle('❓  FAQ - QUESTIONS FRÉQUENTES')
        .addFields(
            {
                name: '🕐 Comment fonctionne le temps ?',
                value:
                    '> Tu commences avec **1 heure**. Chaque seconde le chrono descend.\n' +
                    '> Gagne du temps en tuant : **+10min** (joueur), **+2min** (mob).\n' +
                    '> Si tu atteins **0**, tu passes en spectateur.',
            },
            {
                name: '🛒 Comment marche le shop ?',
                value:
                    '> Fais clic droit sur le **PNJ Marchand** au spawn.\n' +
                    '> Tu payes en **temps** — attention à ne pas trop dépenser !',
            },
            {
                name: '📈 Comment monter de niveau ?',
                value:
                    '> Gagne de l\'**XP** en tuant des joueurs (40 XP), des mobs (5 XP),\n' +
                    '> ou simplement en survivant (3 XP/min).\n' +
                    '> Chaque niveau donne un **bonus de temps** au respawn.',
            },
            {
                name: '⭐ C\'est quoi le prestige ?',
                value:
                    '> Au **niveau 10**, tape `/tc prestige` pour passer au prestige suivant.\n' +
                    '> Tu repars au niveau 1, mais tu gagnes un **multiplicateur XP x1.20** par prestige.\n' +
                    '> Il y a **5 prestiges** en tout.',
            },
            {
                name: '🎲 C\'est quoi les événements ?',
                value:
                    '> Des événements aléatoires se déclenchent toutes les 10-25 minutes :\n' +
                    '> 🌕 Blood Moon (kills x2) • ⏳ Double XP • 🌧️ Pluie de Temps\n' +
                    '> 🌀 Drain Temporel • 👹 Mob Rush • 🏃 Speed Boost • 🕊️ Trêve • 🎰 Jackpot',
            },
            {
                name: '💀 Quels sont les malus ?',
                value:
                    '> **Mort par mob** → -2min (+30s par mort consécutive)\n' +
                    '> **Mort par environnement** → -1min30 (+30s/streak)\n' +
                    '> **AFK 2min+** → -30s toutes les 30 secondes',
            },
            {
                name: '🔗 Commandes utiles',
                value:
                    '```\n' +
                    '/tc time       → Voir ton temps\n' +
                    '/tc level      → Voir ton niveau\n' +
                    '/tc stats      → Tes statistiques\n' +
                    '/tc shop       → Ouvrir le shop\n' +
                    '/tc prestige   → Passer au prestige\n' +
                    '/tc scoreboard → Classement\n' +
                    '```',
            }
        )
        .setFooter({ text: '⏰ TimeCraft — D\'autres questions ? Ouvre un ticket !' });

    return { embeds: [faq] };
}

function buildInfoEmbed() {
    const info = new EmbedBuilder()
        .setColor(COLORS.green)
        .setTitle('🖥️  INFORMATIONS SERVEUR')
        .addFields(
            { name: '📡 IP', value: '```Bientôt disponible```', inline: true },
            { name: '🎮 Version', value: '```1.21```', inline: true },
            { name: '💡 Type', value: '```Paper 1.21```', inline: true },
            { name: '🌍 Mode', value: '> Survie PvP avec système de temps\n> Serveur 24/7 — Rejoins quand tu veux !', inline: false },
            {
                name: '⏰ Mécaniques de temps',
                value:
                    '```diff\n' +
                    '+ Kill joueur    : +10 min\n' +
                    '+ Kill mob       : +2 min\n' +
                    '- Mort par mob   : -2 min\n' +
                    '- Mort par env   : -1 min 30\n' +
                    '- AFK (2min+)    : -30s / 30s\n' +
                    '```',
            }
        )
        .setFooter({ text: '⏰ TimeCraft — Dernière mise à jour' })
        .setTimestamp();

    return { embeds: [info] };
}

async function buildLeaderboardEmbed() {
    const data = isMcDataFresh() ? mcData.leaderboard : null;

    if (!data || !data.players || data.players.length === 0) {
        const lb = new EmbedBuilder()
            .setColor(COLORS.gold)
            .setTitle('📊  CLASSEMENT TIMECRAFT')
            .setDescription(
                '```\n' +
                '╔════╦══════════════════╦═══════════╦══════╗\n' +
                '║ #  ║ Joueur           ║ Temps     ║ Kills║\n' +
                '╠════╬══════════════════╬═══════════╬══════╣\n' +
                '║    ║  Aucune donnée   ║           ║      ║\n' +
                '║    ║  Serveur hors    ║           ║      ║\n' +
                '║    ║  ligne ou vide   ║           ║      ║\n' +
                '╚════╩══════════════════╩═══════════╩══════╝\n' +
                '```'
            )
            .setFooter({ text: '⏰ Serveur peut-être hors ligne • TimeCraft' })
            .setTimestamp();
        return { embeds: [lb] };
    }

    const medals = ['🥇', '🥈', '🥉'];
    let rows = '';
    for (let i = 0; i < data.players.length && i < 15; i++) {
        const p = data.players[i];
        const rank = medals[i] || `${i + 1} `;
        const name = p.name.padEnd(16).slice(0, 16);
        const time = (p.timeFormatted || '--:--:--').padEnd(9).slice(0, 9);
        const kills = String(p.kills).padStart(4);
        const lvl = p.levelName || `Niv.${p.level}`;
        const online = p.online ? '🟢' : '⚫';
        rows += `║ ${rank} ║ ${online} ${name} ║ ${time} ║${kills} ║\n`;
    }

    const lb = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle('📊  CLASSEMENT TIMECRAFT — EN DIRECT')
        .setDescription(
            '```\n' +
            '╔════╦═══════════════════╦═══════════╦═════╗\n' +
            '║ #  ║ Joueur            ║ Temps     ║Kills║\n' +
            '╠════╬═══════════════════╬═══════════╬═════╣\n' +
            rows +
            '╚════╩═══════════════════╩═══════════╩═════╝\n' +
            '```'
        )
        .setFooter({ text: `⏰ ${data.players.length} joueur(s) au classement • TimeCraft` })
        .setTimestamp();

    return { embeds: [lb] };
}

// ═══════════════════════════════════════════════════════════════
//  EMBEDS LIVE MC — STATS / ONLINE / SERVEUR
// ═══════════════════════════════════════════════════════════════

async function buildStatsEmbed(playerName) {
    if (!isMcDataFresh() || !mcData.players) {
        return {
            embeds: [new EmbedBuilder()
                .setColor(COLORS.red)
                .setTitle('❌ Serveur hors ligne')
                .setDescription('Aucune donnée reçue du serveur Minecraft.\nIl est peut-être éteint ou en maintenance.')
                .setTimestamp()]
        };
    }

    const data = mcData.players[playerName.toLowerCase()];

    if (!data) {
        return {
            embeds: [new EmbedBuilder()
                .setColor(COLORS.red)
                .setTitle('❌ Joueur introuvable')
                .setDescription(`Impossible de trouver **${playerName}**.\nLe joueur n'a peut-être jamais joué sur le serveur.`)
                .setTimestamp()]
        };
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.cyan)
        .setTitle(`📈  STATS — ${data.name}`)
        .setThumbnail(`https://mc-heads.net/avatar/${data.name}/128`)
        .addFields(
            { name: '⏱️ Temps de survie', value: `\`${data.timeFormatted}\``, inline: true },
            { name: '⚔️ Kills joueurs', value: `\`${data.kills}\``, inline: true },
            { name: '🏆 Classement', value: `\`#${data.rank}\``, inline: true },
            { name: '📊 Niveau', value: `\`${data.levelName || 'Niv.' + data.level}\` (Prestige ${data.prestige})`, inline: true },
            { name: '✨ XP', value: `\`${data.xp} / ${data.xpNext}\``, inline: true },
            { name: '🟢 En ligne', value: data.online ? '✅ Oui' : '❌ Non', inline: true },
            { name: '🐾 Mobs tués', value: `\`${data.totalMobKills}\``, inline: true },
            { name: '💀 Total kills', value: `\`${data.totalKills}\``, inline: true },
            { name: '⏳ Temps total survécu', value: `\`${data.totalTimeSurvivedFormatted || data.totalTimeSurvived + 's'}\``, inline: true },
        )
        .setFooter({ text: '⏰ TimeCraft — Stats en direct' })
        .setTimestamp();

    return { embeds: [embed] };
}

async function buildOnlineEmbed() {
    const data = isMcDataFresh() ? mcData.online : null;

    if (!data) {
        return {
            embeds: [new EmbedBuilder()
                .setColor(COLORS.red)
                .setTitle('❌ Serveur hors ligne')
                .setDescription('Impossible de contacter le serveur Minecraft.')
                .setTimestamp()]
        };
    }

    let playerList = '';
    if (data.players && data.players.length > 0) {
        for (const p of data.players) {
            const hearts = '❤️'.repeat(Math.min(Math.ceil(p.health / 4), 5));
            playerList += `> 🎮 **${p.name}** — ${hearts} ${Math.round(p.health / 2)}♥ — \`${p.gamemode}\`\n`;
        }
    } else {
        playerList = '> *Aucun joueur en ligne*';
    }

    const embed = new EmbedBuilder()
        .setColor(data.count > 0 ? COLORS.green : COLORS.orange)
        .setTitle(`🟢  JOUEURS EN LIGNE — ${data.count}/${data.max}`)
        .setDescription(playerList)
        .setFooter({ text: '⏰ TimeCraft — En direct' })
        .setTimestamp();

    return { embeds: [embed] };
}

async function buildServerStatusEmbed() {
    const status = isMcDataFresh() ? mcData.status : null;
    const events = isMcDataFresh() ? mcData.events : null;

    if (!status) {
        return {
            embeds: [new EmbedBuilder()
                .setColor(COLORS.red)
                .setTitle('🖥️  SERVEUR HORS LIGNE')
                .setDescription('Le serveur Minecraft ne répond pas.\nIl est probablement en maintenance ou éteint.')
                .setTimestamp()]
        };
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.green)
        .setTitle('🖥️  STATUT DU SERVEUR TIMECRAFT')
        .addFields(
            { name: '👥 Joueurs', value: `\`${status.online}/${status.max}\``, inline: true },
            { name: '🏅 Total inscrits', value: `\`${status.totalPlayers}\``, inline: true },
            { name: '🎮 Partie en cours', value: status.gameRunning ? '✅ Oui' : '❌ Non', inline: true },
            { name: '📡 TPS', value: `\`${status.tps}\``, inline: true },
            { name: '📦 Version', value: `\`${status.version}\``, inline: true },
            { name: '🎪 Événement', value: events?.active ? `✅ **${events.event}**` : '❌ Aucun', inline: true },
        )
        .setDescription(`> ${status.motd || 'TimeCraft — Survivez le plus longtemps possible !'}`)
        .setFooter({ text: '⏰ TimeCraft — Statut en direct' })
        .setTimestamp();

    return { embeds: [embed] };
}

// ═══════════════════════════════════════════════════════════════
//  AUTO-LEADERBOARD — Mise à jour automatique
// ═══════════════════════════════════════════════════════════════

let autoLeaderboardInterval = null;
let autoLeaderboardChannelId = null;
let autoLeaderboardMessageId = null;

async function updateAutoLeaderboard() {
    if (!autoLeaderboardChannelId) return;
    try {
        const channel = await client.channels.fetch(autoLeaderboardChannelId);
        if (!channel) return;

        const embedData = await buildLeaderboardEmbed();

        if (autoLeaderboardMessageId) {
            try {
                const msg = await channel.messages.fetch(autoLeaderboardMessageId);
                await msg.edit(embedData);
                return;
            } catch (_) {
                // Message supprimé, on en renvoie un nouveau
            }
        }

        const sent = await channel.send(embedData);
        autoLeaderboardMessageId = sent.id;
    } catch (e) {
        console.error('❌ Auto-leaderboard:', e.message);
    }
}

// ═══════════════════════════════════════════════════════════════
//  TICKET SYSTEM
// ═══════════════════════════════════════════════════════════════

const STAFF_ROLES = ['👑 Fondateur', '🛡️ Admin', '⚔️ Modérateur'];

function buildTicketPanelEmbed() {
    const embed = new EmbedBuilder()
        .setColor(COLORS.cyan)
        .setTitle('🎫  SUPPORT — OUVRIR UN TICKET')
        .setDescription(
            '> Besoin d\'aide ? Un problème sur le serveur ?\n' +
            '> Un joueur à signaler ? Une question ?\n\n' +
            '**Clique sur le bouton ci-dessous** pour ouvrir un ticket privé.\n' +
            'Un membre du staff te répondra dès que possible !\n\n' +
            '```\n' +
            '📌 Règles des tickets :\n' +
            '• Un seul ticket ouvert à la fois\n' +
            '• Décris ton problème clairement\n' +
            '• Sois patient, le staff répondra vite\n' +
            '• Pas de spam / tickets inutiles\n' +
            '```'
        )
        .setFooter({ text: '⏰ TimeCraft — Support' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_open')
            .setLabel('🎫 Ouvrir un ticket')
            .setStyle(ButtonStyle.Success)
    );

    return { embeds: [embed], components: [row] };
}

async function openTicket(interaction) {
    const guild = interaction.guild;
    const member = interaction.member;

    // Vérifier si un ticket existe déjà
    const existing = guild.channels.cache.find(
        c => c.name === `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    );
    if (existing) {
        return interaction.reply({
            content: `❌ Tu as déjà un ticket ouvert : ${existing}`,
            ephemeral: true
        });
    }

    await interaction.deferReply({ ephemeral: true });

    // Trouver la catégorie SUPPORT
    const supportCategory = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name.includes('SUPPORT')
    );

    // Permissions : user + staff voient, @everyone non
    const permissionOverwrites = [
        {
            id: guild.id, // @everyone
            deny: [PermissionFlagsBits.ViewChannel],
        },
        {
            id: member.id, // Le créateur du ticket
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles],
        },
    ];

    // Ajouter les rôles staff
    for (const staffName of STAFF_ROLES) {
        const staffRole = guild.roles.cache.find(r => r.name === staffName);
        if (staffRole) {
            permissionOverwrites.push({
                id: staffRole.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
            });
        }
    }

    // Créer le salon ticket
    const ticketChannel = await guild.channels.create({
        name: `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: ChannelType.GuildText,
        parent: supportCategory?.id || null,
        permissionOverwrites,
        topic: `🎫 Ticket de ${member.user.tag} — Ouvert le ${new Date().toLocaleDateString('fr-FR')}`,
    });

    // Embed d'accueil dans le ticket
    const welcomeEmbed = new EmbedBuilder()
        .setColor(COLORS.green)
        .setTitle('🎫 Ticket ouvert !')
        .setDescription(
            `Bienvenue ${member} !\n\n` +
            '> **Décris ton problème** le plus précisément possible.\n' +
            '> Un membre du **staff** te répondra rapidement.\n\n' +
            '```\n' +
            '📝 Catégories possibles :\n' +
            '• 🐛 Bug / Problème technique\n' +
            '• 🚨 Signalement de joueur\n' +
            '• ❓ Question générale\n' +
            '• 💡 Suggestion\n' +
            '• 🔄 Demande de remboursement\n' +
            '```'
        )
        .setFooter({ text: `Ticket de ${member.user.tag}` })
        .setTimestamp();

    const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('🔒 Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ embeds: [welcomeEmbed], components: [closeRow] });

    // Ping le staff (supprimé après 5s)
    const ping = await ticketChannel.send(`📢 ${STAFF_ROLES.map(name => {
        const r = guild.roles.cache.find(ro => ro.name === name);
        return r ? `<@&${r.id}>` : '';
    }).filter(Boolean).join(' ')} — Nouveau ticket de **${member.user.displayName}** !`);
    setTimeout(() => ping.delete().catch(() => {}), 5000);

    await interaction.editReply({
        content: `✅ Ticket créé ! → ${ticketChannel}`,
    });
}

async function closeTicket(interaction) {
    const channel = interaction.channel;

    // Vérifier que c'est bien un salon ticket
    if (!channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: '❌ Ce n\'est pas un salon ticket.', ephemeral: true });
    }

    const confirmEmbed = new EmbedBuilder()
        .setColor(COLORS.red)
        .setTitle('🔒 Fermer le ticket ?')
        .setDescription(
            '> Es-tu sûr de vouloir fermer ce ticket ?\n' +
            '> Le salon sera **supprimé** définitivement.\n\n' +
            '⚠️ *Un transcript sera envoyé dans les logs staff.*'
        );

    const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_confirm_close')
            .setLabel('✅ Confirmer la fermeture')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('ticket_cancel_close')
            .setLabel('❌ Annuler')
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [confirmEmbed], components: [confirmRow] });
}

async function confirmCloseTicket(interaction) {
    const channel = interaction.channel;
    const guild = interaction.guild;

    await interaction.update({ content: '🔒 **Fermeture du ticket en cours...**', embeds: [], components: [] });

    // Envoyer un log dans #logs
    const logsChannel = guild.channels.cache.find(
        c => c.name.includes('logs') && c.isTextBased()
    );

    if (logsChannel) {
        const logEmbed = new EmbedBuilder()
            .setColor(COLORS.red)
            .setTitle('🎫 Ticket fermé')
            .addFields(
                { name: '📌 Salon', value: `\`#${channel.name}\``, inline: true },
                { name: '🔒 Fermé par', value: `${interaction.user}`, inline: true },
                { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
            )
            .setFooter({ text: '⏰ TimeCraft — Logs tickets' })
            .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed] });
    }

    // Supprimer le salon après 3 secondes
    setTimeout(() => channel.delete().catch(() => {}), 3000);
}

// ═══════════════════════════════════════════════════════════════
//  INTERACTION HANDLER
// ═══════════════════════════════════════════════════════════════

client.on('interactionCreate', async (interaction) => {

    // ── Boutons de rôles & tickets ──
    if (interaction.isButton()) {
        const member = interaction.member;
        if (!member) return;

        // ── Ticket buttons ──
        if (interaction.customId === 'ticket_open') {
            return openTicket(interaction);
        }
        if (interaction.customId === 'ticket_close') {
            return closeTicket(interaction);
        }
        if (interaction.customId === 'ticket_confirm_close') {
            return confirmCloseTicket(interaction);
        }
        if (interaction.customId === 'ticket_cancel_close') {
            return interaction.update({ content: '✅ Fermeture annulée.', embeds: [], components: [] });
        }

        // ── Role buttons ──
        const roleMap = {
            'role_notif': '🔔 Notifications',
            'role_joueur': '🎮 Joueur',
        };

        const roleName = roleMap[interaction.customId];
        if (!roleName) return;

        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            return interaction.reply({ content: '❌ Rôle introuvable.', ephemeral: true });
        }

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            return interaction.reply({ content: `✅ Rôle **${roleName}** retiré !`, ephemeral: true });
        } else {
            await member.roles.add(role);
            return interaction.reply({ content: `✅ Rôle **${roleName}** ajouté !`, ephemeral: true });
        }
    }

    // ── Slash Commands ──
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'setup':
            await setupServer(interaction);
            break;

        case 'welcome':
            await interaction.reply({ content: '📨 Message de bienvenue envoyé !', ephemeral: true });
            await interaction.channel.send(buildWelcomeEmbeds());
            break;

        case 'rules':
            await interaction.reply({ content: '📚 Règles envoyées !', ephemeral: true });
            await interaction.channel.send(buildRulesEmbeds());
            break;

        case 'faq':
            await interaction.reply({ content: '❓ FAQ envoyée !', ephemeral: true });
            await interaction.channel.send(buildFaqEmbeds());
            break;

        case 'info':
            await interaction.reply({ content: '📋 Infos envoyées !', ephemeral: true });
            await interaction.channel.send(buildInfoEmbed());
            break;

        case 'leaderboard':
            await interaction.deferReply();
            await interaction.editReply(await buildLeaderboardEmbed());
            break;

        case 'ticket':
            await interaction.reply({ content: '🎫 Panneau de tickets envoyé !', ephemeral: true });
            await interaction.channel.send(buildTicketPanelEmbed());
            break;

        case 'stats': {
            const playerName = interaction.options.getString('joueur');
            await interaction.deferReply();
            await interaction.editReply(await buildStatsEmbed(playerName));
            break;
        }

        case 'online':
            await interaction.deferReply();
            await interaction.editReply(await buildOnlineEmbed());
            break;

        case 'serveur':
            await interaction.deferReply();
            await interaction.editReply(await buildServerStatusEmbed());
            break;

        case 'autoleaderboard':
            autoLeaderboardChannelId = interaction.channelId;
            autoLeaderboardMessageId = null;
            if (autoLeaderboardInterval) clearInterval(autoLeaderboardInterval);
            autoLeaderboardInterval = setInterval(updateAutoLeaderboard, 2 * 60 * 1000); // 2 min
            await updateAutoLeaderboard();
            await interaction.reply({ content: '✅ Classement auto-mis à jour toutes les 2 minutes dans ce salon !', ephemeral: true });
            break;
    }
});

// ═══════════════════════════════════════════════════════════════
//  WELCOME MESSAGE ON JOIN
// ═══════════════════════════════════════════════════════════════

client.on('guildMemberAdd', async (member) => {
    // Donner le rôle Joueur automatiquement
    const joueurRole = member.guild.roles.cache.find(r => r.name === '🎮 Joueur');
    if (joueurRole) {
        try { await member.roles.add(joueurRole); } catch (e) { }
    }

    // Trouver le salon bienvenue
    const welcomeChannel = member.guild.channels.cache.find(
        c => c.name.includes('bienvenue') && c.isTextBased()
    );
    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle('👋 Nouveau voyageur temporel !')
        .setDescription(
            `Bienvenue **${member.user.displayName}** sur **TimeCraft** ! ⏰\n\n` +
            `> 📚 Lis les règles\n` +
            `> 🎮 L'IP arrive bientôt — reste connecté !\n` +
            `> ⏳ Ton aventure commence bientôt !`
        )
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .setFooter({ text: `Membre #${member.guild.memberCount}` })
        .setTimestamp();

    await welcomeChannel.send({ embeds: [embed] });
});

// ═══════════════════════════════════════════════════════════════
//  BOT START
// ═══════════════════════════════════════════════════════════════

client.once('ready', async () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`  ⏰ TimeCraft Bot connecté !`);
    console.log(`  👤 ${client.user.tag}`);
    console.log(`  🏠 ${client.guilds.cache.size} serveur(s)`);
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('📌 Commandes disponibles :');
    console.log('   /setup            → Crée les salons, rôles, catégories');
    console.log('   /welcome          → Envoie le message de bienvenue');
    console.log('   /rules            → Envoie les règles');
    console.log('   /faq              → Envoie la FAQ');
    console.log('   /info             → Envoie les infos serveur MC');
    console.log('   /leaderboard      → Classement en temps réel');
    console.log('   /stats <joueur>   → Stats d\'un joueur');
    console.log('   /online           → Joueurs en ligne');
    console.log('   /serveur          → Statut du serveur MC');
    console.log('   /autoleaderboard  → Auto-update classement');
    console.log('   /ticket           → Panneau de tickets');
    console.log('');

    try {
        await registerCommands();
    } catch (e) {
        console.error('❌ Erreur enregistrement commandes:', e.message);
    }
});

client.on('error', (e) => console.error('❌ Erreur client:', e.message));
process.on('unhandledRejection', (e) => console.error('❌ Erreur non gérée:', e));

// Démarrer le récepteur API pour recevoir les données MC
startAPIReceiver();

client.login(TOKEN).catch(e => {
    console.error('❌ Impossible de se connecter:', e.message);
    process.exit(1);
});
