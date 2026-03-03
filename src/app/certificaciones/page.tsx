"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LangKeys } from "@/i18n/translations";

export default function CertificacionesPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState<"intro" | "quiz" | "passed" | "failed">("intro");
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

    // Demo quiz based on the 2 question / 4 option requirement
    const quiz = [
        {
            id: 1,
            question: t("cert.quiz.q1" as LangKeys),
            options: [
                t("cert.quiz.q1.o1" as LangKeys),
                t("cert.quiz.q1.o2" as LangKeys),
                t("cert.quiz.q1.o3" as LangKeys),
                t("cert.quiz.q1.o4" as LangKeys)
            ],
            correctIndex: 1
        },
        {
            id: 2,
            question: t("cert.quiz.q2" as LangKeys),
            options: [
                t("cert.quiz.q2.o1" as LangKeys),
                t("cert.quiz.q2.o2" as LangKeys),
                t("cert.quiz.q2.o3" as LangKeys),
                t("cert.quiz.q2.o4" as LangKeys)
            ],
            correctIndex: 1
        }
    ];

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleQuizSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let score = 0;
        quiz.forEach((q) => {
            if (selectedAnswers[q.id] === q.correctIndex) {
                score++;
            }
        });

        if (score === quiz.length) {
            setStep("passed");
        } else {
            setStep("failed");
        }
    };

    const resetQuiz = () => {
        setSelectedAnswers({});
        setStep("quiz");
    };

    return (
        <div className="pt-20">
            <main className="flex-1 max-w-[1024px] mx-auto w-full px-6 py-12">
                <div className="flex flex-col gap-4 max-w-3xl mb-12">
                    <nav className="flex items-center gap-2 text-sm text-text-muted">
                        <Link className="hover:text-primary transition-colors" href="/">{t("nav.home" as LangKeys)}</Link>
                        <span className="material-icons-round text-[16px]">chevron_right</span>
                        <span className="font-medium text-primary">{t("cert.nav.cert" as LangKeys)}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-black font-display text-secondary">
                        {t("cert.title" as LangKeys)}
                    </h1>
                    <p className="text-lg text-text-muted">
                        {t("cert.desc" as LangKeys)}
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-accent/50 shadow-sm p-8 md:p-12 relative overflow-hidden">
                    {/* Background decors */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none"></div>

                    {/* Step 1: Intro */}
                    {step === "intro" && (
                        <div className="flex flex-col gap-6 relative z-10 max-w-2xl">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-accent/30 text-primary flex items-center justify-center">
                                    <span className="material-icons-round text-2xl">verified</span>
                                </div>
                                <h2 className="text-2xl font-bold font-display text-secondary">{t("cert.intro.title" as LangKeys)}</h2>
                            </div>
                            <p className="text-text-main leading-relaxed">
                                {t("cert.intro.desc" as LangKeys)}
                            </p>
                            <div className="bg-accent/20 p-4 rounded-xl border border-accent/50">
                                <ul className="text-sm text-text-muted space-y-2">
                                    <li className="flex items-center gap-2"><span className="material-icons-round text-[16px] text-primary">check_circle</span> {t("cert.intro.req1" as LangKeys)}</li>
                                    <li className="flex items-center gap-2"><span className="material-icons-round text-[16px] text-primary">check_circle</span> {t("cert.intro.req2" as LangKeys)}</li>
                                    <li className="flex items-center gap-2"><span className="material-icons-round text-[16px] text-primary">check_circle</span> {t("cert.intro.req3" as LangKeys)}</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => setStep("quiz")}
                                className="mt-4 px-8 py-3 w-fit bg-primary text-white font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-sm flex items-center gap-2"
                            >
                                {t("cert.intro.start" as LangKeys)}
                                <span className="material-icons-round text-sm">arrow_forward</span>
                            </button>
                        </div>
                    )}

                    {/* Step 2: Quiz */}
                    {step === "quiz" && (
                        <form onSubmit={handleQuizSubmit} className="flex flex-col gap-8 relative z-10 max-w-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold font-display text-secondary">{t("cert.quiz.title" as LangKeys)}</h2>
                                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{t("cert.quiz.progress" as LangKeys)} {Object.keys(selectedAnswers).length}/{quiz.length}</span>
                            </div>

                            <div className="space-y-10">
                                {quiz.map((q, qIndex) => (
                                    <div key={q.id} className="flex flex-col gap-4">
                                        <p className="font-bold text-text-main text-lg"><span className="text-primary mr-2">{qIndex + 1}.</span> {q.question}</p>
                                        <div className="flex flex-col gap-3">
                                            {q.options.map((option, oIndex) => (
                                                <label
                                                    key={oIndex}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedAnswers[q.id] === oIndex
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'border-accent/50 bg-white hover:border-primary/50'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        value={oIndex}
                                                        checked={selectedAnswers[q.id] === oIndex}
                                                        onChange={() => handleOptionSelect(q.id, oIndex)}
                                                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                                        required
                                                    />
                                                    <span className="text-text-main text-sm font-medium">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-accent/40" />

                            <button
                                type="submit"
                                disabled={Object.keys(selectedAnswers).length < quiz.length}
                                className="px-8 py-4 w-full sm:w-auto bg-primary text-white font-bold rounded-xl hover:bg-[#689153] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2 self-start"
                            >
                                {t("cert.quiz.submit" as LangKeys)}
                            </button>
                        </form>
                    )}

                    {/* Step 3: Passed */}
                    {step === "passed" && (
                        <div className="flex flex-col items-center text-center gap-6 relative z-10 py-10 animate-fade-in-up">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                                <span className="material-icons-round text-5xl">workspace_premium</span>
                            </div>
                            <h2 className="text-3xl font-bold font-display text-secondary">{t("cert.passed.title" as LangKeys)}</h2>
                            <p className="text-text-main max-w-md">
                                {t("cert.passed.desc" as LangKeys)}
                            </p>

                            <div className="bg-accent/10 p-6 rounded-2xl border border-accent/30 w-full max-w-md mt-4 text-left shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="material-icons-round text-red-500 text-4xl">picture_as_pdf</span>
                                    <div>
                                        <p className="font-bold text-text-main">{t("cert.passed.filename" as LangKeys)}</p>
                                        <p className="text-xs text-text-muted">{t("cert.passed.meta" as LangKeys)} • 1.2 MB</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors">
                                    <span className="material-icons-round">download</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setStep("intro")}
                                className="mt-6 text-sm font-bold text-text-muted hover:text-primary underline underline-offset-4"
                            >
                                {t("cert.passed.back" as LangKeys)}
                            </button>
                        </div>
                    )}

                    {/* Step 4: Failed */}
                    {step === "failed" && (
                        <div className="flex flex-col items-center text-center gap-6 relative z-10 py-10 animate-fade-in-up">
                            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2 shadow-inner border border-red-100">
                                <span className="material-icons-round text-5xl">cancel</span>
                            </div>
                            <h2 className="text-3xl font-bold font-display text-secondary">{t("cert.failed.title" as LangKeys)}</h2>
                            <p className="text-text-main max-w-md">
                                {t("cert.failed.desc" as LangKeys)}
                            </p>

                            <button
                                onClick={resetQuiz}
                                className="mt-4 px-8 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2"
                            >
                                {t("cert.failed.retry" as LangKeys)}
                                <span className="material-icons-round text-sm">refresh</span>
                            </button>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
