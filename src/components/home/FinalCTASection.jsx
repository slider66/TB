import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const FinalCTASection = ({ onStartClick }) => {
    return (
        <section className="gradient-orange py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold text-white mb-6">
                        ¿Listo para simplificar tu burocracia?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Únete a miles de usuarios que ya han simplificado sus trámites
                    </p>
                    <Button 
                        className="bg-white text-orange hover:bg-neutral-100 text-lg px-8 py-4"
                        onClick={() => onStartClick('COMPLETE')}
                    >
                        Empezar Ahora
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTASection;