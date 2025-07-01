// Image assets from Figma design
const imgGoVocalBluePink1 = "http://localhost:3845/assets/7c3642148c2da39840809fcc4f17d3b4c835b514.svg";
const imgRasayel = "http://localhost:3845/assets/a93d927177286720874c8b2ac1eeebe5d9d4c242.svg";
const img = "http://localhost:3845/assets/1b955e3adbad4f4c01cefc39d25bcbfe9244ea33.svg";
const img1 = "http://localhost:3845/assets/ce9a05a00213e1f09b9088a8ea3a6839404e2133.svg";
const img2 = "http://localhost:3845/assets/16a82794817e55b5ac1b8eef1bffd70af8d80ee8.svg";
const img3 = "http://localhost:3845/assets/0decee21743f32a44248c76cf07383477ed012b6.svg";
const imgGroupR5 = "http://localhost:3845/assets/aff1886ce08278637eab46434504334f9bec9fb0.svg";

export default function Home() {
  return (
    <div className="bg-white min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-9 py-9">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-medium text-slate-900">
              Antoine Pirard
            </h1>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <p className="text-lg leading-relaxed text-slate-800 font-normal">
                Design leader scaling startups from nothing to millions in ARR.
              </p>
            </div>

            <div>
              <p className="text-lg leading-relaxed text-slate-800 font-normal">
                — I&apos;m building experiences and teams that allow businesses to scale to their full potential.
              </p>
            </div>

            <div>
              <p className="text-lg leading-relaxed text-slate-800 font-normal">
                Over the last 10 years, I&apos;ve helped early-stage startup founders create products from the ground up, 
                led teams and developed successful product strategy. I thrive in strategic chaos clearing and crafting 
                the detailed experiences that make a product feel complete.
              </p>
            </div>
          </div>

          {/* Company Logos Section */}
          <div className="mt-9">
            <div className="flex gap-6 items-center flex-wrap">
              <div className="h-8 flex items-center">
                <img 
                  src={imgGoVocalBluePink1} 
                  alt="GoVocal" 
                  className="h-8 w-auto"
                />
              </div>
              <div className="h-8 flex items-center">
                <img 
                  src={imgRasayel} 
                  alt="Rasayel" 
                  className="h-8 w-auto"
                />
              </div>
              <div className="h-6 flex items-center">
                <img 
                  src={imgGroupR5} 
                  alt="Cambridge Judge Business School" 
                  className="h-6 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-6">
            <div className="flex gap-4 items-center">
              <div className="w-6 h-6 cursor-pointer">
                <img src={img} alt="Social" className="w-full h-full" />
              </div>
              <div className="w-6 h-6 cursor-pointer">
                <img src={img1} alt="Social" className="w-full h-full" />
              </div>
              <div className="w-6 h-6 cursor-pointer">
                <img src={img2} alt="Social" className="w-full h-full" />
              </div>
              <div className="w-6 h-6 cursor-pointer">
                <img src={img3} alt="Social" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
