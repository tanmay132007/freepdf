
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Shield, Zap, Mail, ChevronDown } from 'lucide-react'

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Start free. Upgrade when you need more.',
      features: [
        '27 basic tools',
        '25MB max file size',
        '20 operations per day',
        'Files deleted immediately',
        { text: 'No OCR or AI tools', included: false },
      ],
      button: 'Get Started Free',
      href: '/signup',
      highlight: false
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 9 : 7.20,
      description: 'The complete PDF toolkit with AI power.',
      features: [
        'All 29 tools including AI',
        '200MB max file size',
        'Unlimited operations',
        'Files kept 7 days',
        'OCR + AI Summarizer + Translator',
        'Priority processing',
      ],
      button: 'Go Pro',
      href: '/signup',
      highlight: true,
      badge: 'Most Popular'
    },
    {
      name: 'Business',
      price: billingCycle === 'monthly' ? 29 : 23.20,
      description: 'Built for teams and power users.',
      features: [
        'Everything in Pro',
        '500MB max file size',
        'Files kept 30 days',
        '5 team members',
        'API access',
        'Batch processing',
      ],
      button: 'Contact Sales',
      href: '/contact',
      highlight: false
    }
  ]

  const faqs = [
    { q: "Can I use SavePDF without signing up?", a: "Yes! You can use all basic tools without an account. However, Pro features like AI Summarizer and larger file limits require a subscription." },
    { q: "How secure are my files?", a: "We use 256-bit SSL encryption for all file transfers. Your files are automatically deleted after processing (or after a set time for Pro users)." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Google Pay." },
    { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription from your account dashboard with one click." },
    { q: "Do you offer refunds?", a: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with the Pro features." }
  ]

  const comparisons = [
    { feature: 'Tools Included', free: '27 Basic', pro: 'All 29 (inc. AI)', biz: 'All 29 + API' },
    { feature: 'Max File Size', free: '25 MB', pro: '200 MB', biz: '500 MB' },
    { feature: 'Daily Limit', free: '20 Operations', pro: 'Unlimited', biz: 'Unlimited' },
    { feature: 'Storage Duration', free: 'Immediate', pro: '7 Days', biz: '30 Days' },
    { feature: 'AI Capabilities', free: false, pro: true, biz: true },
    { feature: 'Team Support', free: false, pro: false, biz: '5 Members' },
    { feature: 'Batch Processing', free: false, pro: false, biz: true },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="pt-24 pb-16 px-8 text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter animate-in fade-in slide-in-from-top-6 duration-700">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Start free. Upgrade when you need more. No hidden fees.
        </p>

        <div className="flex items-center justify-center gap-4 pt-10">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all"
          >
            <div className={`h-6 w-6 bg-emerald-700 rounded-full shadow-lg transition-all ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Save 20%</span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all hover:translate-y-[-8px] ${
                plan.highlight 
                ? 'border-emerald-700 bg-white shadow-2xl shadow-emerald-500/10 z-10' 
                : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-700 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest leading-none">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 font-bold">/mo</span>
                </div>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed font-medium">
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {typeof feature === 'string' ? (
                      <>
                        <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} />
                        </div>
                        <span className="text-sm text-slate-600 font-medium">{feature}</span>
                      </>
                    ) : (
                      <>
                        <div className="h-5 w-5 rounded-full bg-emerald-50 text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                          <X size={12} />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{feature.text}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <Link
                to={plan.href}
                className={`w-full py-4 rounded-2xl text-center font-bold transition-all shadow-lg text-sm ${
                  plan.highlight 
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white py-24 px-8 border-y border-slate-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900">Detailed Comparison</h2>
            <p className="text-slate-500 mt-2 font-medium">Find the right plan for your workflow</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-6 text-xs font-bold text-slate-400 tracking-widest uppercase">Feature</th>
                  <th className="p-6 text-xs font-bold text-slate-400 tracking-widest uppercase">Free</th>
                  <th className="p-6 text-xs font-bold text-slate-400 tracking-widest uppercase">Pro</th>
                  <th className="p-6 text-xs font-bold text-slate-400 tracking-widest uppercase">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors font-medium">
                    <td className="p-6 text-sm font-bold text-slate-800">{row.feature}</td>
                    <td className="p-6 text-sm text-slate-500">
                      {typeof row.free === 'boolean' ? (row.free ? <Check className="text-green-500" /> : <X className="text-rose-300" />) : row.free}
                    </td>
                    <td className="p-6 text-sm text-slate-500">
                      {typeof row.pro === 'boolean' ? (row.pro ? <Check className="text-green-500" /> : <X className="text-rose-300" />) : row.pro}
                    </td>
                    <td className="p-6 text-sm text-slate-800 font-bold">
                      {typeof row.biz === 'boolean' ? (row.biz ? <Check className="text-green-500" /> : <X className="text-rose-300" />) : row.biz}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group p-6 bg-white border border-slate-200 rounded-3xl transition-all open:shadow-xl open:shadow-slate-200/50">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h4 className="text-lg font-bold text-slate-800 pr-8">{faq.q}</h4>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="pt-4 text-slate-500 leading-relaxed font-medium text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-8 pt-12">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 text-white">
            <Shield size={200} />
          </div>
          <div className="absolute bottom-0 left-0 p-10 opacity-10 text-white">
            <Zap size={200} />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white relative z-10 leading-tight">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-slate-400 max-w-xl mx-auto relative z-10 font-medium">
            Join 2 million people who use SavePDF to manage their documents every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/signup" className="w-full sm:w-auto bg-emerald-700 text-white font-bold py-5 px-10 rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20">
              Get Started for Free
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-white/10 text-white font-bold py-5 px-10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
