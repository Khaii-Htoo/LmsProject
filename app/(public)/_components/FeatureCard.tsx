import { motion } from "framer-motion";
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start invisible and slightly down
      whileInView={{ opacity: 1, y: 0 }} // Animate to visible and original position
      viewport={{ once: true, amount: 0.3 }} // Trigger animation once when 30% is in view
      transition={{ duration: 0.6, ease: "easeOut" }} // Animation settings
      className="p-6 border border-border/30 rounded-lg bg-card hover:bg-card/50 transition-all duration-300 ease-in-out flex flex-col items-center text-center"
    >
      <div className="mb-4 p-3 bg-muted/20 rounded-full inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
