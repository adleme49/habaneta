import React from 'react';
import { useTranslation } from 'react-i18next';
import { IBorder } from '../../../../context/interfaces';
import { ambients, AmbientId } from '../../../../lib/ambients';
import { useStore } from '../../../../store/store';

const EnviromentModalContent: React.FC<{
  onClose: Function;
  img: string;
  border?: IBorder;
}> = ({ img, onClose, border }) => {
  const { t } = useTranslation();
  const { selectedAmbient, setSelectedAmbientId } = useStore();

  const imgStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    left: '27em',
    top: '27em',
    transform: 'perspective(1200px) rotateX(68deg)',
  };
  const imgStyleDouble: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    left: '27em',
    top: '27em',
    transform: 'perspective(1200px) rotateX(68deg) rotateZ(90deg)',
  };
  const ambientStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 2,
    width: '80vw',
  };

  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">{t('preview.environment')}</span>
        <button
          onClick={() => onClose()}
          className="text-white text-xl"
          aria-label={t('common.close')}
        >
          ×
        </button>
      </div>
      <div className="px-4 py-2 border-b bg-white flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wide mr-1">
          {t('ambient.scene')}
        </span>
        {ambients.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelectedAmbientId(a.id as AmbientId)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              selectedAmbient.id === a.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-accent border-border text-foreground'
            }`}
          >
            {t(a.labelKey)}
          </button>
        ))}
      </div>
      <div className="w-full p-0 m-0">
        <div className="flex">
          <img
            src={selectedAmbient.imgUrl}
            style={ambientStyle}
            alt={t(selectedAmbient.labelKey)}
          />
          <img
            src={img}
            style={border && border.cornerInteriorUrl ? imgStyleDouble : imgStyle}
            alt="grid"
          />
        </div>
      </div>
    </>
  );
};

export default EnviromentModalContent;
