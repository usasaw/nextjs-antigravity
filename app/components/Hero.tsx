

export default function Hero() {
    return (
        <section className="w-full flex flex-col items-center pt-12 pb-24 px-6 md:px-12">
            <h1 className="text-5xl md:text-7xl font-serif text-dark-green mb-6 text-center tracking-tight">
                Browse everything.
            </h1>
            <p className="text-lg text-gray-600 mb-12 max-w-xl text-center">
                Organize your life with a tool designed for clarity.
                Plan List helps you focus on what matters most.
            </p>

            {/* Hero Image / Dashboard Preview */}
            <div className="w-full max-w-5xl relative">
                {/* Background decorative element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] bg-primary-green/20 blur-3xl rounded-full -z-10" />

                <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-secondary-beige to-[#EAE4D9] rounded-2xl shadow-2xl overflow-hidden border border-white/50">
                    {/* Mock UI Content */}
                    <div className="absolute inset-4 bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/60">
                        <div className="flex justify-between items-center mb-8">
                            <div className="h-4 w-32 bg-dark-green/10 rounded-full" />
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-white/50" />
                                <div className="h-8 w-8 rounded-full bg-white/50" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 h-full">
                            <div className="col-span-2 space-y-4">
                                <div className="h-32 bg-white/60 rounded-lg" />
                                <div className="h-24 bg-white/60 rounded-lg" />
                            </div>
                            <div className="col-span-1 space-y-4">
                                <div className="h-full bg-dark-green/5 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand strip */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
                {/* Simple SVG placeholders for brands */}
                <div className="h-8 w-24 bg-current rounded" />
                <div className="h-8 w-24 bg-current rounded" />
                <div className="h-8 w-24 bg-current rounded" />
                <div className="h-8 w-24 bg-current rounded" />
            </div>
        </section>
    );
}
