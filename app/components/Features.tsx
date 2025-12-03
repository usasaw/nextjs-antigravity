export default function Features() {
    return (
        <section className="w-full py-24 px-6 md:px-12 bg-white">
            <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-serif text-dark-green mb-4">
                    We&apos;ve cracked the code.
                </h2>
                <p className="text-gray-500">Built for those who build.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                {[
                    { title: "Focus", desc: "Distraction-free environment for deep work." },
                    { title: "Plan", desc: "Intuitive tools to map out your success." },
                    { title: "Execute", desc: "Track progress and celebrate wins." },
                    { title: "Review", desc: "Insights to help you improve every day." }
                ].map((feature, i) => (
                    <div key={i} className="space-y-2">
                        <h3 className="font-serif text-xl text-dark-green">{feature.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Feature Image Parallax-like section */}
            <div className="w-full h-[500px] rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-dark-green/10" />
                {/* Abstract Landscape placeholder */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 bg-gradient-to-t from-black/50 to-transparent w-full">
                    <h3 className="text-white font-serif text-3xl md:text-4xl">See the Big Picture</h3>
                </div>
            </div>
        </section>
    );
}
