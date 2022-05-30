import React from 'react';
import TypeAnimation from 'react-type-animation';

function Home() {
    return (
        <TypeAnimation
            cursor={false}
            sequence={['Optimisez vos revenus tout en préservant la planète', 1000, 'C\'est possible avec parkT !', 1000]}
            wrapper="h1"
            repeat={10}
            className="title mt-5 has-text-white"
        />
    );
}

export default Home;