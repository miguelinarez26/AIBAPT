const mockPartners = [
    {
        "id": 1,
        "name": "Daniel Gabarra",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "brainspotting_trainer",
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Daniel%20Gabarra&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.87"
    },
    {
        "id": 2,
        "name": "Esly Regina Souza de Carvalho",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "brainspotting_trainer",
            "emdr_trainer",
            "psychodrama_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Esly%20Regina%20Souza%20de%20Carvalho&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "100.01.01"
    },
    {
        "id": 3,
        "name": "Glenda Zulay Villamarin Bernal",
        "country": "Ecuador",
        "city": "Internacional",
        "certifications": [
            "brainspotting_trainer",
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Glenda%20Zulay%20Villamarin%20Bernal&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "201.02.125"
    },
    {
        "id": 4,
        "name": "Mario Constantino Salvador Fernández",
        "country": "España",
        "city": "Internacional",
        "certifications": [
            "brainspotting_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mario%20Constantino%20Salvador%20Fern%C3%A1ndez&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "100.02.005"
    },
    {
        "id": 5,
        "name": "Silvia Guz",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "brainspotting_trainer",
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Silvia%20Guz&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "100.01.02"
    },
    {
        "id": 6,
        "name": "Dimara Marques Ribeiro",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer",
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Dimara%20Marques%20Ribeiro&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.02.32"
    },
    {
        "id": 7,
        "name": "Ivan Maldonado Galarza",
        "country": "Ecuador",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ivan%20Maldonado%20Galarza&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.018"
    },
    {
        "id": 8,
        "name": "Jackeline Figueiredo Barbosa Gomes",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer",
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Jackeline%20Figueiredo%20Barbosa%20Gomes&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.25"
    },
    {
        "id": 9,
        "name": "Julieta Lau Sang",
        "country": "Panamá",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Julieta%20Lau%20Sang&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.068"
    },
    {
        "id": 10,
        "name": "Maher Hassan Musleh",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maher%20Hassan%20Musleh&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.95"
    },
    {
        "id": 11,
        "name": "María Belén Romá Romero",
        "country": "Perú",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mar%C3%ADa%20Bel%C3%A9n%20Rom%C3%A1%20Romero&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "100.02.004"
    },
    {
        "id": 12,
        "name": "María Gabriela Ruiz Lozano",
        "country": "México",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mar%C3%ADa%20Gabriela%20Ruiz%20Lozano&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.114"
    },
    {
        "id": 13,
        "name": "Patrício Galleguillos Givovich",
        "country": "Chile",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Patr%C3%ADcio%20Galleguillos%20Givovich&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.02.006"
    },
    {
        "id": 14,
        "name": "Raquel Hoersting",
        "country": "Brasil / Canadá",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Raquel%20Hoersting&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.94"
    },
    {
        "id": 15,
        "name": "Santiago Hernán Jácome Ordoñes",
        "country": "Ecuador",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer",
            "psychodrama_trainer"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Santiago%20Hern%C3%A1n%20J%C3%A1come%20Ordo%C3%B1es&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "100.02.003"
    },
    {
        "id": 16,
        "name": "Silvana Ricci Salomoni",
        "country": "Brasil",
        "city": "Internacional",
        "certifications": [
            "emdr_trainer",
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Silvana%20Ricci%20Salomoni&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.07"
    },
    {
        "id": 17,
        "name": "Ana Paula Abreu Machado",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ana%20Paula%20Abreu%20Machado&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.166"
    },
    {
        "id": 18,
        "name": "Ana Rita Mendes Colobialle",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ana%20Rita%20Mendes%20Colobialle&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.114"
    },
    {
        "id": 19,
        "name": "Ana Valéria Cajado Escobar",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ana%20Val%C3%A9ria%20Cajado%20Escobar&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.127"
    },
    {
        "id": 20,
        "name": "Angela Beatriz Sand",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Angela%20Beatriz%20Sand&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.10"
    },
    {
        "id": 21,
        "name": "Daisy Ortiz de Oliveira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Daisy%20Ortiz%20de%20Oliveira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.37"
    },
    {
        "id": 22,
        "name": "Danielly Bart do Nascimento",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Danielly%20Bart%20do%20Nascimento&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.149"
    },
    {
        "id": 23,
        "name": "Denise Franco Vicente M. Menezes",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Denise%20Franco%20Vicente%20M.%20Menezes&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.83"
    },
    {
        "id": 24,
        "name": "Doris Wertzner Borges",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Doris%20Wertzner%20Borges&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.135"
    },
    {
        "id": 25,
        "name": "Eleonora C. M. Monteiro Damian",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Eleonora%20C.%20M.%20Monteiro%20Damian&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.36"
    },
    {
        "id": 26,
        "name": "Eliza Augusta Pires",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Eliza%20Augusta%20Pires&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.55"
    },
    {
        "id": 27,
        "name": "Érika Campos Gomes",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=%C3%89rika%20Campos%20Gomes&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.139"
    },
    {
        "id": 28,
        "name": "Evelin Bruno",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Evelin%20Bruno&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.132"
    },
    {
        "id": 29,
        "name": "Fernanda Coutinho Machado",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Fernanda%20Coutinho%20Machado&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.148"
    },
    {
        "id": 30,
        "name": "Fernanda Miranda Vitoriano",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Fernanda%20Miranda%20Vitoriano&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.152"
    },
    {
        "id": 31,
        "name": "Flávia Daniele Pereira Arruda de Oliveira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Fl%C3%A1via%20Daniele%20Pereira%20Arruda%20de%20Oliveira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.109"
    },
    {
        "id": 32,
        "name": "Geovana Fuzer Polsaque",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Geovana%20Fuzer%20Polsaque&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.02.82"
    },
    {
        "id": 33,
        "name": "Giovanna G. Peralta De la Vega",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Giovanna%20G.%20Peralta%20De%20la%20Vega&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.02.027"
    },
    {
        "id": 34,
        "name": "Glaucia Teixeira Costa de Siqueira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Glaucia%20Teixeira%20Costa%20de%20Siqueira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.47"
    },
    {
        "id": 35,
        "name": "Glenda Patricia de Oliveira A Gomes",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Glenda%20Patricia%20de%20Oliveira%20A%20Gomes&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.35"
    },
    {
        "id": 36,
        "name": "José Fábio Ponciano de Jesus",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Jos%C3%A9%20F%C3%A1bio%20Ponciano%20de%20Jesus&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.131"
    },
    {
        "id": 37,
        "name": "José Fernando de Souza Silva",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Jos%C3%A9%20Fernando%20de%20Souza%20Silva&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.122"
    },
    {
        "id": 38,
        "name": "Juliana Izabel Polydoro",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Juliana%20Izabel%20Polydoro&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.163"
    },
    {
        "id": 39,
        "name": "Juliana Urioste Sotomayor",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Juliana%20Urioste%20Sotomayor&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.139"
    },
    {
        "id": 40,
        "name": "Juliano Bazzo Jota",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Juliano%20Bazzo%20Jota&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.113"
    },
    {
        "id": 41,
        "name": "Keila Cristina Bomfim",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Keila%20Cristina%20Bomfim&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.101"
    },
    {
        "id": 42,
        "name": "Líbia de Fonseca Alecrim",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=L%C3%ADbia%20de%20Fonseca%20Alecrim&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.137"
    },
    {
        "id": 43,
        "name": "Liege Costa Simões",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Liege%20Costa%20Sim%C3%B5es&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.50"
    },
    {
        "id": 44,
        "name": "Lorrani Borges Leite",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Lorrani%20Borges%20Leite&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.123"
    },
    {
        "id": 45,
        "name": "Lucia Binelli Catan",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Lucia%20Binelli%20Catan&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.31"
    },
    {
        "id": 46,
        "name": "Lucia da Silva Pires Padilha",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Lucia%20da%20Silva%20Pires%20Padilha&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.153"
    },
    {
        "id": 47,
        "name": "Luciana Luisa Cisneiros Vanini",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Luciana%20Luisa%20Cisneiros%20Vanini&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.124"
    },
    {
        "id": 48,
        "name": "Marcela Col Tomanik",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Marcela%20Col%20Tomanik&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.118"
    },
    {
        "id": 49,
        "name": "Marcia de Oliveira Carvalho",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Marcia%20de%20Oliveira%20Carvalho&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.91"
    },
    {
        "id": 50,
        "name": "Margareth de Jesús Cardoso",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Margareth%20de%20Jes%C3%BAs%20Cardoso&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.16"
    },
    {
        "id": 51,
        "name": "Maria Aparecida de Souza Malcher",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20Aparecida%20de%20Souza%20Malcher&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.180"
    },
    {
        "id": 52,
        "name": "Maria Gabriela Calvopina Loaiza",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20Gabriela%20Calvopina%20Loaiza&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.136"
    },
    {
        "id": 53,
        "name": "Maria Joana Casagrande Soares Correia",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20Joana%20Casagrande%20Soares%20Correia&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.150"
    },
    {
        "id": 54,
        "name": "Maria Lina Moratelli Prado",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20Lina%20Moratelli%20Prado&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.108"
    },
    {
        "id": 55,
        "name": "Maria Regina Sana",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20Regina%20Sana&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.42"
    },
    {
        "id": 56,
        "name": "Maricelma Bregola",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maricelma%20Bregola&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.143"
    },
    {
        "id": 57,
        "name": "Marilene Aparecida Garban Philot Fernandes",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Marilene%20Aparecida%20Garban%20Philot%20Fernandes&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.151"
    },
    {
        "id": 58,
        "name": "Maristela Colombo",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maristela%20Colombo&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.67"
    },
    {
        "id": 59,
        "name": "Mariza Aguiar Carraz Loureiro",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mariza%20Aguiar%20Carraz%20Loureiro&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.116"
    },
    {
        "id": 60,
        "name": "Mary Carmen Falero Torres",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mary%20Carmen%20Falero%20Torres&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.48"
    },
    {
        "id": 61,
        "name": "Mirian Alves da Silva Zeppe",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mirian%20Alves%20da%20Silva%20Zeppe&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.102"
    },
    {
        "id": 62,
        "name": "Míryan Rodrigues Franco Oliveira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=M%C3%ADryan%20Rodrigues%20Franco%20Oliveira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.105"
    },
    {
        "id": 63,
        "name": "Nádia Maria Silva Pacheco",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=N%C3%A1dia%20Maria%20Silva%20Pacheco&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.146"
    },
    {
        "id": 64,
        "name": "Neide Zucoli de Oliveira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Neide%20Zucoli%20de%20Oliveira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.70"
    },
    {
        "id": 65,
        "name": "Odilia Ladeira Grilo Santos",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Odilia%20Ladeira%20Grilo%20Santos&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.99"
    },
    {
        "id": 66,
        "name": "Olga Regina Tersario",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Olga%20Regina%20Tersario&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.51"
    },
    {
        "id": 67,
        "name": "Paula de Castro Pena Emediato",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Paula%20de%20Castro%20Pena%20Emediato&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.20"
    },
    {
        "id": 68,
        "name": "Pedro Bregola de Barros",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Pedro%20Bregola%20de%20Barros&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.132"
    },
    {
        "id": 69,
        "name": "Rachel Moreira de Abreu Goraieb",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Rachel%20Moreira%20de%20Abreu%20Goraieb&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.140"
    },
    {
        "id": 70,
        "name": "Raquel de Paiva",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Raquel%20de%20Paiva&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.136"
    },
    {
        "id": 71,
        "name": "Renata C. Homem de Mello",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Renata%20C.%20Homem%20de%20Mello&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.23"
    },
    {
        "id": 72,
        "name": "Renata Whitaker Horchutz",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Renata%20Whitaker%20Horchutz&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.09"
    },
    {
        "id": 73,
        "name": "Roselaine Sônego",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Roselaine%20S%C3%B4nego&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.76"
    },
    {
        "id": 74,
        "name": "Rosimary Ap de Oliveira M Vilela",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Rosimary%20Ap%20de%20Oliveira%20M%20Vilela&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.30"
    },
    {
        "id": 75,
        "name": "Ruti Litwinczuk",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ruti%20Litwinczuk&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.181"
    },
    {
        "id": 76,
        "name": "Sailin Vieira Thomaz",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Sailin%20Vieira%20Thomaz&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.103"
    },
    {
        "id": 77,
        "name": "Stephanie Toledo Piza Maurano Fernandes",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Stephanie%20Toledo%20Piza%20Maurano%20Fernandes&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.144"
    },
    {
        "id": 78,
        "name": "Verónica Jazmin Corral Proaño",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ver%C3%B3nica%20Jazmin%20Corral%20Proa%C3%B1o&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.129"
    },
    {
        "id": 79,
        "name": "Vilma Rodrigues Santos",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Vilma%20Rodrigues%20Santos&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.61"
    },
    {
        "id": 80,
        "name": "Vitória Rassam Arrivabene",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Vit%C3%B3ria%20Rassam%20Arrivabene&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.107"
    },
    {
        "id": 81,
        "name": "Vivian Davis Stipp",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Vivian%20Davis%20Stipp&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "302.01.19"
    },
    {
        "id": 82,
        "name": "Viviane Berton de Fraga Bozzo",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Viviane%20Berton%20de%20Fraga%20Bozzo&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.96"
    },
    {
        "id": 83,
        "name": "Yve do Prado Albuquerque",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_therapist"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Yve%20do%20Prado%20Albuquerque&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.01.119"
    },
    {
        "id": 84,
        "name": "Adineide Nolasco Andrade Dias",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Adineide%20Nolasco%20Andrade%20Dias&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.111"
    },
    {
        "id": 85,
        "name": "Adriana Selene Zanonato",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Adriana%20Selene%20Zanonato&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.52"
    },
    {
        "id": 86,
        "name": "Aline Conceição",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Aline%20Concei%C3%A7%C3%A3o&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.97"
    },
    {
        "id": 87,
        "name": "Andreia Chagas Pereira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Andreia%20Chagas%20Pereira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.24"
    },
    {
        "id": 88,
        "name": "Aurora Luna Walss",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Aurora%20Luna%20Walss&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "401.02.069"
    },
    {
        "id": 89,
        "name": "Daniela Reis e Silva",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Daniela%20Reis%20e%20Silva&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.08"
    },
    {
        "id": 90,
        "name": "Danilo Pichioli da Silveira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Danilo%20Pichioli%20da%20Silveira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.86"
    },
    {
        "id": 91,
        "name": "Elizabeth Regina Maio",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Elizabeth%20Regina%20Maio&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.04"
    },
    {
        "id": 92,
        "name": "Fernando José Daibert de Araújo",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Fernando%20Jos%C3%A9%20Daibert%20de%20Ara%C3%BAjo&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.77"
    },
    {
        "id": 93,
        "name": "Greice Caroline Das Neves Pasqualotto",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Greice%20Caroline%20Das%20Neves%20Pasqualotto&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.38"
    },
    {
        "id": 94,
        "name": "Ilma Pereira",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Ilma%20Pereira&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.33"
    },
    {
        "id": 95,
        "name": "Livia Baumgarten Entringer",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Livia%20Baumgarten%20Entringer&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.106"
    },
    {
        "id": 96,
        "name": "Maher Musleh",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maher%20Musleh&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.95"
    },
    {
        "id": 97,
        "name": "Marcia Pereira Dias",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Marcia%20Pereira%20Dias&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.53"
    },
    {
        "id": 98,
        "name": "Maria Elizabete Oliveira Bragança Cardoso",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20Elizabete%20Oliveira%20Bragan%C3%A7a%20Cardoso&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.64"
    },
    {
        "id": 99,
        "name": "Maria Inês Kalil Juliano de Mesquita",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Maria%20In%C3%AAs%20Kalil%20Juliano%20de%20Mesquita&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.85"
    },
    {
        "id": 100,
        "name": "María Soledad La Mura Cerdá",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mar%C3%ADa%20Soledad%20La%20Mura%20Cerd%C3%A1&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.02.072"
    },
    {
        "id": 101,
        "name": "Mariana Gottschalg Matos",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Mariana%20Gottschalg%20Matos&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.112"
    },
    {
        "id": 102,
        "name": "Narda Murillo Salvatierra",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Narda%20Murillo%20Salvatierra&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "301.02.096"
    },
    {
        "id": 103,
        "name": "Raquel Roersting",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Raquel%20Roersting&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.94"
    },
    {
        "id": 104,
        "name": "Sandra Renata Jessula da Costa",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Sandra%20Renata%20Jessula%20da%20Costa&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.90"
    },
    {
        "id": 105,
        "name": "Symone Lopes Francelino Gonçalves Silva",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Symone%20Lopes%20Francelino%20Gon%C3%A7alves%20Silva&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.69"
    },
    {
        "id": 106,
        "name": "Teresa Cristina Guedes de Paula Freire",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Teresa%20Cristina%20Guedes%20de%20Paula%20Freire&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.66"
    },
    {
        "id": 107,
        "name": "Wendy Prado",
        "country": "Iberoamérica",
        "city": "Internacional",
        "certifications": [
            "emdr_supervisor"
        ],
        "avatar": "https://ui-avatars.com/api/?name=Wendy%20Prado&background=219653&color=fff",
        "email": "info@aibapt.org",
        "bio": "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
        "code": "402.01.27"
    }
];

const countriesList = ["Brasil","Brasil / Canadá","Chile","Ecuador","España","Iberoamérica","México","Panamá","Perú"];