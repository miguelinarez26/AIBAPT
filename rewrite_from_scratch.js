const fs = require('fs');

let content = fs.readFileSync('tmp_original.tsx', 'utf8');

// 1. Rename FormacionesContent to accept props and rename export
content = content.replace('function FormacionesContent() {', `interface FormacionesClientProps {
    initialEvents: any[];
    initialWebinars: any[];
    currentLang: string;
}

function FormacionesContent({ initialEvents, initialWebinars, currentLang }: FormacionesClientProps) {`);

content = content.replace('export default function FormacionesPage() {', 'export default function FormacionesClient(props: FormacionesClientProps) {');
content = content.replace('<FormacionesContent />', '<FormacionesContent {...props} />');

// 2. Replace webinarsData definition
const newWebinarsData = `    const webinarsData = useMemo(() => initialWebinars.map((w: any) => {
        const isOfficial = true;
        return {
            img: isOfficial ? logoAibapt : (w.thumbnail_url || placeholderImg),
            badge: w.badge || "VOD / Grabación",
            badgeIcon: "play_circle",
            badgeStyle: "text-secondary",
            category: w.category || "WEBINAR",
            title: w.title,
            desc: w.description,
            instructorImg: w.instructor_img || "",
            instructorName: w.instructor_name || "AIBAPT",
            route: w.video_url || \`/formaciones/\${w.slug}\`,
            duration: w.duration,
            price: w.price || "Gratuito",
            isOfficial: isOfficial,
            language: w.language || "es"
        };
    }), [initialWebinars]);`;

content = content.replace(/const webinarsData = useMemo\(\(\) => \[[\s\S]*?\], \[\]\);/, newWebinarsData);

// 3. Replace eventsData definition
const newEventsData = `    const eventsData = useMemo(() => initialEvents.map((e: any) => {
        const isOfficial = e.is_official || e.category_label?.toLowerCase().includes("oficial");
        return {
            img: isOfficial ? logoAibapt : (e.thumbnail_url || placeholderImg),
            badge: e.event_date ? (() => {
                const [year, month, day] = e.event_date.split('-').map(Number);
                return new Date(year, month - 1, day).toLocaleDateString(lang === "es" ? "es-ES" : "pt-BR", { day: "numeric", month: "long" });
            })() : "Próximamente",
            badgeIcon: e.badge_icon || "calendar_today",
            badgeStyle: "text-primary",
            category: e.location || "ONLINE",
            title: e.title,
            desc: e.description,
            instructorImg: e.instructor_img || "",
            instructorName: e.instructor_name || "AIBAPT",
            route: e.registration_url || "/formaciones",
            price: e.price || (lang === "es" ? "Inscripción Abierta" : "Inscrição Aberta"),
            isOfficial: isOfficial,
            duration: ""
        };
    }), [initialEvents, lang]);`;

content = content.replace(/const eventsData = useMemo\(\(\) => \[[\s\S]*?\], \[\]\);/, newEventsData);

// 4. Delete recordingsData completely
content = content.replace(/const recordingsData = useMemo\(\(\) => WEBINARS_DATA[\s\S]*?\], \[\]\);/, '');
// Also remove WEBINARS_DATA import
content = content.replace(/import \{ WEBINARS_DATA \} from "@\/data\/webinars";\n/, '');

// 5. Update currentData to include accreditedData and map it to the unified format
const newCurrentData = `    const currentData = useMemo(() => {
        if (activeTab === "events") return eventsData;
        if (activeTab === "recordings") return webinarsData;
        if (activeTab === "accredited") return accreditedData.map((item: any) => ({
            ...item,
            img: placeholderImg,
            category: "CURSO ACREDITADO",
            badge: item.hours,
            badgeIcon: "schedule",
            badgeStyle: "text-secondary",
            instructorName: item.instructor,
            isOfficial: false,
            route: item.contact,
            price: item.linkTitle || "Contactar",
            desc: item.instructor
        }));
        return [];
    }, [activeTab, webinarsData, eventsData, accreditedData]);`;

content = content.replace(/const currentData = useMemo\(\(\) => \{[\s\S]*?\}, \[activeTab, webinarsData, eventsData, recordingsData\]\);/, newCurrentData);

// 6. Fix activeTab conditionals for rendering
content = content.replace(/\{\(activeTab === "events" \|\| activeTab === "recordings"\) && \(/g, `{(activeTab === "events" || activeTab === "recordings" || activeTab === "accredited") && (`);
content = content.replace(/\{\(activeTab === "events" \|\| activeTab === "recordings" \|\| activeTab === "accredited"\) && \(\s*<div className="flex flex-wrap md:flex-nowrap items-center/g, `{(activeTab === "events" || activeTab === "recordings") && (
                                                <div className="flex flex-wrap md:flex-nowrap items-center`);

// 7. Remove the old empty divs at the bottom for accredited and accreditation
content = content.replace(/\{\/\* Accredited and Accreditation views \*\/\}\s*\{activeTab === "accredited" && \(\s*<div><\/div>\s*\)\}/, '');

// 8. Fix useEffect for handling ?id URL param
content = content.replace(/sourceData = recordingsData;/g, 'sourceData = webinarsData;');
content = content.replace(/\[searchParams, webinarsData, eventsData, recordingsData, activeTab\]/g, '[searchParams, webinarsData, eventsData, activeTab]');

fs.writeFileSync('src/app/[lang]/formaciones/FormacionesClient.tsx', content, 'utf8');
console.log('Done!');
