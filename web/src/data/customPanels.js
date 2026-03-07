// Only paintings with confirmed image_url are included.
// Artists with zero such paintings are omitted entirely.

export const AMERICAN_ANIMATION = {
  id: 'custom-american-animation',
  name_zh: '美式動畫藝術家',
  name_en: 'American Animation Artists',
  type: 'animation',
  artists: [
    {
      id: 'tex-avery',
      name_zh: '泰克斯·艾佛瑞',
      name_en: 'Tex Avery',
      image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Tex_Avery_portrait.webp/258px-Tex_Avery_portrait.webp.png',
      paintings: [
        { id: 'ta-1', name_zh: '垂耳狗卓比', name_en: 'Droopy', image_url: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Droopy_dog.png' },
        { id: 'ta-2', name_zh: '瘋狂松鼠', name_en: 'Screwy Squirrel', image_url: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Screwy_Squirrel.png' },
      ],
    },
    {
      id: 'hanna-barbera',
      name_zh: '漢納-巴貝拉',
      name_en: 'Hanna-Barbera (William Hanna & Joseph Barbera)',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/JBarbera.jpg/330px-JBarbera.jpg',
      paintings: [
        { id: 'hb-3', name_zh: '史酷比', name_en: 'Scooby-Doo', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Scooby_doo_logo.png/330px-Scooby_doo_logo.png' },
        { id: 'hb-4', name_zh: '瑜伽熊', name_en: 'Yogi Bear', image_url: 'https://upload.wikimedia.org/wikipedia/en/f/f0/Yogi_Bear_Yogi_Bear.png' },
      ],
    },
    {
      id: 'chuck-jones',
      name_zh: '查克·瓊斯',
      name_en: 'Chuck Jones',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Chuck_Jones2_%28cropped%29.jpg/330px-Chuck_Jones2_%28cropped%29.jpg',
      paintings: [
        { id: 'cj-1', name_zh: '兔八哥', name_en: 'Bugs Bunny', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Bugs_Bunny.svg/330px-Bugs_Bunny.svg.png' },
        { id: 'cj-2', name_zh: '威利狼與嗶嗶鳥', name_en: 'Wile E. Coyote and Road Runner', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/88/Tobeepornottobeep.jpg/330px-Tobeepornottobeep.jpg' },
        { id: 'cj-3', name_zh: '鬼靈精', name_en: 'How the Grinch Stole Christmas!', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/How_the_grinch_stole_christmas_1966_print_ad_premiere.jpg/330px-How_the_grinch_stole_christmas_1966_print_ad_premiere.jpg' },
      ],
    },
    {
      id: 'ralph-bakshi',
      name_zh: '拉爾夫·巴克希',
      name_en: 'Ralph Bakshi',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/RalphBakshiJan09.jpg/330px-RalphBakshiJan09.jpg',
      paintings: [
        { id: 'rb-1', name_zh: '貓兒菲利茲', name_en: 'Fritz the Cat', image_url: 'https://upload.wikimedia.org/wikipedia/en/7/75/Fritz_the_Cat_%28film%29.jpg' },
        { id: 'rb-2', name_zh: '魔法師', name_en: 'Wizards', image_url: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Wizards-movie-poster-md.jpg' },
        { id: 'rb-3', name_zh: '魔戒（1978）', name_en: 'The Lord of the Rings (1978)', image_url: 'https://upload.wikimedia.org/wikipedia/en/4/40/The_Lord_of_the_Rings_%281978%29.jpg' },
      ],
    },
    {
      id: 'mary-blair',
      name_zh: '瑪麗·布萊爾',
      name_en: 'Mary Blair',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mary_Blair.jpg/330px-Mary_Blair.jpg',
      paintings: [
        { id: 'mb-1', name_zh: '仙履奇緣', name_en: 'Cinderella (1950)', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/1950_is_the_Cinderella_year.jpg/330px-1950_is_the_Cinderella_year.jpg' },
        { id: 'mb-2', name_zh: '愛麗絲夢遊仙境', name_en: 'Alice in Wonderland (1951)', image_url: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Alice_in_Wonderland_%281951_film%29_poster.jpg' },
        { id: 'mb-3', name_zh: '小飛俠', name_en: 'Peter Pan (1953)', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Peter_Pan_%281953_poster%29.jpg/330px-Peter_Pan_%281953_poster%29.jpg' },
      ],
    },
    {
      id: 'ward-kimball',
      name_zh: '沃德·金博爾',
      name_en: 'Ward Kimball',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Ward_Kimball%2C_1976.jpg/330px-Ward_Kimball%2C_1976.jpg',
      paintings: [
        { id: 'wk-1', name_zh: '幻想曲', name_en: 'Fantasia (1940)', image_url: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Fantasia1940.jpg' },
        { id: 'wk-2', name_zh: '木偶奇遇記', name_en: 'Pinocchio (1940)', image_url: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Pinocchio-1940-poster.jpg' },
        { id: 'wk-3', name_zh: '小鹿斑比', name_en: 'Bambi (1942)', image_url: 'https://upload.wikimedia.org/wikipedia/en/8/88/Walt_Disney%27s_Bambi_poster.jpg' },
      ],
    },
    {
      id: 'don-bluth',
      name_zh: '唐·布魯斯',
      name_en: 'Don Bluth',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Don_Bluth_by_Gage_Skidmore.jpg/330px-Don_Bluth_by_Gage_Skidmore.jpg',
      paintings: [
        { id: 'db-1', name_zh: '美國鼠譚', name_en: 'An American Tail', image_url: 'https://upload.wikimedia.org/wikipedia/en/b/ba/An_American_Tail_poster.jpg' },
        { id: 'db-3', name_zh: '阿納斯塔西婭', name_en: 'Anastasia', image_url: 'https://upload.wikimedia.org/wikipedia/en/3/36/Anastasia-don-bluth.jpg' },
      ],
    },
    {
      id: 'glen-keane',
      name_zh: '葛倫·基恩',
      name_en: 'Glen Keane',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/GlenKeaneHeadshotColor.jpg/330px-GlenKeaneHeadshotColor.jpg',
      paintings: [
        { id: 'gk-1', name_zh: '小美人魚', name_en: 'The Little Mermaid', image_url: 'https://upload.wikimedia.org/wikipedia/en/c/c0/The_Little_Mermaid_%28Official_1989_Film_Poster%29.png' },
        { id: 'gk-2', name_zh: '美女與野獸', name_en: 'Beauty and the Beast', image_url: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Beauty_and_the_Beast_%281991_film%29_poster.jpg' },
        { id: 'gk-3', name_zh: '魔髮奇緣', name_en: 'Tangled', image_url: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Tangled_poster.jpg' },
      ],
    },
    {
      id: 'eric-goldberg',
      name_zh: '艾瑞克·高柏格',
      name_en: 'Eric Goldberg',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Eric_Goldberg.jpg/330px-Eric_Goldberg.jpg',
      paintings: [
        { id: 'eg-2', name_zh: '大力士', name_en: 'Hercules', image_url: 'https://upload.wikimedia.org/wikipedia/en/6/65/Hercules_%281997_film%29_poster.jpg' },
        { id: 'eg-3', name_zh: '幻想曲2000', name_en: 'Fantasia 2000', image_url: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Fantasia2000_Poster.jpg' },
      ],
    },
    {
      id: 'brad-bird',
      name_zh: '布萊德·博德',
      name_en: 'Brad Bird',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Brad_bird_cropped_2009.jpg',
      paintings: [
        { id: 'bb-1', name_zh: '鋼鐵巨人', name_en: 'The Iron Giant', image_url: 'https://upload.wikimedia.org/wikipedia/en/d/d3/The_Iron_Giant_poster.JPG' },
        { id: 'bb-2', name_zh: '超人特攻隊', name_en: 'The Incredibles', image_url: 'https://upload.wikimedia.org/wikipedia/en/2/27/The_Incredibles_%282004_animated_feature_film%29.jpg' },
        { id: 'bb-3', name_zh: '料理鼠王', name_en: 'Ratatouille', image_url: 'https://upload.wikimedia.org/wikipedia/en/5/50/RatatouillePoster.jpg' },
      ],
    },
    {
      id: 'pete-docter',
      name_zh: '彼特·達克特',
      name_en: 'Pete Docter',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Pete_Docter_cropped_2009.jpg',
      paintings: [
        { id: 'pd-1', name_zh: '怪獸電力公司', name_en: 'Monsters, Inc.', image_url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Monsters_Inc.JPG' },
        { id: 'pd-2', name_zh: '天外奇蹟', name_en: 'Up', image_url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Up_%282009_film%29.jpg' },
        { id: 'pd-3', name_zh: '腦筋急轉彎', name_en: 'Inside Out', image_url: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Inside_Out_%282015_film%29_poster.jpg' },
        { id: 'pd-4', name_zh: '靈魂急轉彎', name_en: 'Soul', image_url: 'https://upload.wikimedia.org/wikipedia/en/3/39/Soul_%282020_film%29_poster.jpg' },
      ],
    },
    {
      id: 'genndy-tartakovsky',
      name_zh: '根迪·塔塔科夫斯基',
      name_en: 'Genndy Tartakovsky',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Genndy_Tartakovsky_2023_2.jpg/330px-Genndy_Tartakovsky_2023_2.jpg',
      paintings: [
        { id: 'gt-1', name_zh: '德克斯特的實驗室', name_en: "Dexter's Laboratory", image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Dexter-logo.png/330px-Dexter-logo.png' },
        { id: 'gt-3', name_zh: '星際大戰：克隆人戰爭', name_en: 'Star Wars: Clone Wars', image_url: 'https://upload.wikimedia.org/wikipedia/en/a/af/CloneWarslogo.JPG' },
      ],
    },
    {
      id: 'matt-groening',
      name_zh: '麥特·格勒寧',
      name_en: 'Matt Groening',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Matt_Groening_2025.jpg/330px-Matt_Groening_2025.jpg',
      paintings: [
        { id: 'mg-1', name_zh: '辛普森家庭', name_en: 'The Simpsons', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/The_Simpsons_yellow_logo.svg/330px-The_Simpsons_yellow_logo.svg.png' },
        { id: 'mg-2', name_zh: '飛出個未來', name_en: 'Futurama', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Futurama_1999_logo.svg/330px-Futurama_1999_logo.svg.png' },
      ],
    },
    {
      id: 'seth-macfarlane',
      name_zh: '賽斯·麥克法蘭',
      name_en: 'Seth MacFarlane',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Seth_MacFarlane_SDCC_2017_%2836524516106%29.jpg/330px-Seth_MacFarlane_SDCC_2017_%2836524516106%29.jpg',
      paintings: [
        { id: 'sm-1', name_zh: '蓋酷家庭', name_en: 'Family Guy', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Family_Guy_Logo.svg/330px-Family_Guy_Logo.svg.png' },
        { id: 'sm-2', name_zh: '美國老爸', name_en: 'American Dad!', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/American_dad_logo.svg/330px-American_dad_logo.svg.png' },
      ],
    },
    {
      id: 'rebecca-sugar',
      name_zh: '瑞貝卡·薩格爾',
      name_en: 'Rebecca Sugar',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rebecca_Sugar_Peabody_Awards_%28cropped%29.jpg/330px-Rebecca_Sugar_Peabody_Awards_%28cropped%29.jpg',
      paintings: [
        { id: 'rs-1', name_zh: '星際寶貝', name_en: 'Steven Universe', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Steven_Universe_-_Title_Card.png/330px-Steven_Universe_-_Title_Card.png' },
        { id: 'rs-2', name_zh: '星際寶貝：電影', name_en: 'Steven Universe: The Movie', image_url: 'https://upload.wikimedia.org/wikipedia/en/8/85/StevenUniverseTheMoviePoster.png' },
      ],
    },
    {
      id: 'pendleton-ward',
      name_zh: '彭德爾頓·沃德',
      name_en: 'Pendleton Ward',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rob_Sorcher_and_Pendleton_Ward%2C_May_2015_%28cropped%29.jpg/330px-Rob_Sorcher_and_Pendleton_Ward%2C_May_2015_%28cropped%29.jpg',
      paintings: [
        { id: 'pw-1', name_zh: '探險活寶', name_en: 'Adventure Time', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Adventure_Time_-_Title_card.png/330px-Adventure_Time_-_Title_card.png' },
      ],
    },
    {
      id: 'alex-hirsch',
      name_zh: '亞歷克斯·赫許',
      name_en: 'Alex Hirsch',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Alex_Hirsch_2018.jpg/330px-Alex_Hirsch_2018.jpg',
      paintings: [
        { id: 'ah-1', name_zh: '怪誕小鎮', name_en: 'Gravity Falls', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Gravity_Falls_logo.png/330px-Gravity_Falls_logo.png' },
      ],
    },
    {
      id: 'lauren-faust',
      name_zh: '羅倫·福斯特',
      name_en: 'Lauren Faust',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/LaurenFaustSPFF.png/330px-LaurenFaustSPFF.png',
      paintings: [
        { id: 'lf-2', name_zh: '彩虹小馬：友情就是魔法', name_en: 'My Little Pony: Friendship Is Magic', image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/My_Little_Pony_Friendship_Is_Magic_logo_-_2017.svg/330px-My_Little_Pony_Friendship_Is_Magic_logo_-_2017.svg.png' },
      ],
    },
  ],
}

export const JAPANESE_ANIME = {
  id: 'custom-japanese-anime',
  name_zh: '日式動漫藝術家',
  name_en: 'Japanese Anime Artists',
  type: 'anime',
  artists: [
    {
      id: 'osamu-tezuka',
      name_zh: '手塚治虫',
      name_en: 'Osamu Tezuka',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Osamu_Tezuka_1951_Scan10008-2.JPG/330px-Osamu_Tezuka_1951_Scan10008-2.JPG',
      paintings: [
        { id: 'ot-1', name_zh: '原子小金剛', name_en: 'Astro Boy', image_url: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Astro_Boy-08.jpg' },
        { id: 'ot-2', name_zh: '怪醫黑傑克', name_en: 'Black Jack', image_url: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Black_Jack_manga_vol_1.jpg' },
        { id: 'ot-3', name_zh: '火鳥', name_en: 'Phoenix', image_url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Phoenix_%28manga%29_volume_1.jpg' },
      ],
    },
    {
      id: 'akira-toriyama',
      name_zh: '鳥山明',
      name_en: 'Akira Toriyama',
      image_url: 'https://upload.wikimedia.org/wikipedia/en/1/15/Akira_Toriyama_in_1982.jpg',
      paintings: [
        { id: 'at-2', name_zh: '阿拉蕾', name_en: 'Dr. Slump', image_url: 'https://upload.wikimedia.org/wikipedia/en/c/cd/DrSlump1.jpg' },
        { id: 'at-3', name_zh: '最終幻想IX角色設計', name_en: 'Final Fantasy IX character design', image_url: 'https://upload.wikimedia.org/wikipedia/en/5/51/Ffixbox.jpg' },
      ],
    },
    {
      id: 'katsuhiro-otomo',
      name_zh: '大友克洋',
      name_en: 'Katsuhiro Otomo',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Katsuhiro_Otomo.jpg/330px-Katsuhiro_Otomo.jpg',
      paintings: [
        { id: 'ko-1', name_zh: '阿基拉', name_en: 'Akira', image_url: 'https://upload.wikimedia.org/wikipedia/en/7/70/Akira_Volume_1_Cover_Japanese_Version_%28Manga%29.jpg' },
        { id: 'ko-2', name_zh: '大都會', name_en: 'Metropolis', image_url: 'https://upload.wikimedia.org/wikipedia/en/f/ff/Metropolisanime_poster.jpg' },
      ],
    },
    {
      id: 'hayao-miyazaki',
      name_zh: '宮崎駿',
      name_en: 'Hayao Miyazaki',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/HayaoMiyazakiCCJuly09.jpg/330px-HayaoMiyazakiCCJuly09.jpg',
      paintings: [
        { id: 'hm-1', name_zh: '風之谷', name_en: 'Nausicaä of the Valley of the Wind', image_url: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Nausicaaposter.jpg' },
        { id: 'hm-2', name_zh: '天空之城', name_en: 'Castle in the Sky', image_url: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Castle_in_the_Sky_%281986%29.png' },
        { id: 'hm-3', name_zh: '龍貓', name_en: 'My Neighbor Totoro', image_url: 'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg' },
        { id: 'hm-4', name_zh: '神隱少女', name_en: 'Spirited Away', image_url: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png' },
        { id: 'hm-5', name_zh: '霍爾的移動城堡', name_en: "Howl's Moving Castle", image_url: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Howls-moving-castleposter.jpg' },
      ],
    },
    {
      id: 'yoshitaka-amano',
      name_zh: '天野喜孝',
      name_en: 'Yoshitaka Amano',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Yoshitaka_Amano_Oct_2006.jpg/330px-Yoshitaka_Amano_Oct_2006.jpg',
      paintings: [
        { id: 'ya-1', name_zh: '最終幻想系列角色設計', name_en: 'Final Fantasy series character design', image_url: 'https://upload.wikimedia.org/wikipedia/en/d/d8/FF1_USA_boxart.jpg' },
        { id: 'ya-2', name_zh: '吸血鬼獵人D', name_en: 'Vampire Hunter D', image_url: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Vampire_Hunter_D_Volume_1_Cover.jpg' },
      ],
    },
    {
      id: 'mamoru-oshii',
      name_zh: '押井守',
      name_en: 'Mamoru Oshii',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Mamoru_Oshii_-_Lucca_Comics_%26_Games_2015.JPG/330px-Mamoru_Oshii_-_Lucca_Comics_%26_Games_2015.JPG',
      paintings: [
        { id: 'mo-1', name_zh: '攻殼機動隊', name_en: 'Ghost in the Shell', image_url: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Ghostintheshellposter.jpg' },
        { id: 'mo-2', name_zh: '攻殼機動隊2：無辜者', name_en: 'Ghost in the Shell 2: Innocence', image_url: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Ghost_in_the_Shell_2_Innocence.jpg' },
        { id: 'mo-3', name_zh: '機動警察', name_en: 'Patlabor', image_url: 'https://upload.wikimedia.org/wikipedia/en/9/96/Patlabor_The_Movie_poster.png' },
      ],
    },
    {
      id: 'hideaki-anno',
      name_zh: '庵野秀明',
      name_en: 'Hideaki Anno',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Godzilla_Resurgence_World_Premiere_Red_Carpet-_Anno_Hideaki_%2828526527191%29.jpg/330px-Godzilla_Resurgence_World_Premiere_Red_Carpet-_Anno_Hideaki_%2828526527191%29.jpg',
      paintings: [
        { id: 'ha-1', name_zh: '新世紀福音戰士', name_en: 'Neon Genesis Evangelion', image_url: 'https://upload.wikimedia.org/wikipedia/en/7/72/Evangelion_retouched.png' },
        { id: 'ha-2', name_zh: '福音戰士新劇場版：破', name_en: 'Evangelion: 2.0', image_url: 'https://upload.wikimedia.org/wikipedia/en/1/13/RoE20Poster.jpg' },
      ],
    },
    {
      id: 'satoshi-kon',
      name_zh: '今敏',
      name_en: 'Satoshi Kon',
      image_url: 'https://upload.wikimedia.org/wikipedia/en/4/44/Cropped_Photo_of_Satoshi_Kon.jpg',
      paintings: [
        { id: 'sk-1', name_zh: '藍色恐懼', name_en: 'Perfect Blue', image_url: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Perfectblueposter.png' },
        { id: 'sk-2', name_zh: '千年女優', name_en: 'Millennium Actress', image_url: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Sennenyoyu.jpg' },
        { id: 'sk-3', name_zh: '東京教父', name_en: 'Tokyo Godfathers', image_url: 'https://upload.wikimedia.org/wikipedia/en/e/ef/Tokyo_Godfathers_%28Movie_Poster%29.jpg' },
        { id: 'sk-4', name_zh: '盜夢偵探', name_en: 'Paprika', image_url: 'https://upload.wikimedia.org/wikipedia/en/1/16/Paprikaposter.jpg' },
      ],
    },
    {
      id: 'makoto-shinkai',
      name_zh: '新海誠',
      name_en: 'Makoto Shinkai',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Makoto_Shinkai%2C_2023.jpg/330px-Makoto_Shinkai%2C_2023.jpg',
      paintings: [
        { id: 'ms-1', name_zh: '秒速五公分', name_en: '5 Centimeters per Second', image_url: 'https://upload.wikimedia.org/wikipedia/en/9/92/5_Centimeters_Per_Second.jpg' },
        { id: 'ms-2', name_zh: '言葉之庭', name_en: 'The Garden of Words', image_url: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Garden_of_Words_poster.png' },
        { id: 'ms-3', name_zh: '你的名字', name_en: 'Your Name', image_url: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png' },
        { id: 'ms-4', name_zh: '天氣之子', name_en: 'Weathering with You', image_url: 'https://upload.wikimedia.org/wikipedia/en/6/66/Weathering_with_You_Poster.jpg' },
        { id: 'ms-5', name_zh: '鈴芽之旅', name_en: 'Suzume', image_url: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Suzume_no_Tojimari_poster.jpg' },
      ],
    },
    {
      id: 'kentaro-miura',
      name_zh: '三浦建太郎',
      name_en: 'Kentaro Miura',
      image_url: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Kentaro_Miura_in_2020.jpg',
      paintings: [
        { id: 'km-1', name_zh: '烙印戰士', name_en: 'Berserk', image_url: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Berserk_vol01.png' },
      ],
    },
    {
      id: 'naoki-urasawa',
      name_zh: '浦澤直樹',
      name_en: 'Naoki Urasawa',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Naoki_Urasawa_in_2012_%28cropped%29.jpg/330px-Naoki_Urasawa_in_2012_%28cropped%29.jpg',
      paintings: [
        { id: 'nu-1', name_zh: '怪物', name_en: 'Monster', image_url: 'https://upload.wikimedia.org/wikipedia/en/0/00/Monster_manga_volume_1_cover.jpg' },
        { id: 'nu-2', name_zh: '二十世紀少年', name_en: '20th Century Boys', image_url: 'https://upload.wikimedia.org/wikipedia/en/e/e2/20thcenturyboys01.jpg' },
        { id: 'nu-3', name_zh: 'PLUTO', name_en: 'Pluto', image_url: 'https://upload.wikimedia.org/wikipedia/en/e/ef/Pluto_%28manga%29_1.png' },
      ],
    },
    {
      id: 'tatsuki-fujimoto',
      name_zh: '藤本樹',
      name_en: 'Tatsuki Fujimoto',
      paintings: [
        { id: 'tf-1', name_zh: '電鋸人', name_en: 'Chainsaw Man', image_url: 'https://upload.wikimedia.org/wikipedia/en/2/24/Chainsawman.jpg' },
        { id: 'tf-2', name_zh: '再見，繪梨', name_en: 'Goodbye, Eri', image_url: 'https://upload.wikimedia.org/wikipedia/en/d/da/Goodbye%2C_Eri_volume_cover.jpg' },
        { id: 'tf-3', name_zh: '回望', name_en: 'Look Back', image_url: 'https://upload.wikimedia.org/wikipedia/en/7/77/Look_Back_volume_cover.jpg' },
      ],
    },
  ],
}
