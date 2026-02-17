import React from 'react';
import { TryoutEvent } from '../../types';
import { formatDate, getPositionLabel, isRegistrationOpen } from '../../utils/tryoutData';
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Target, 
  Phone, 
  Mail, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface TryoutCardProps {
  tryout: TryoutEvent;
  onRegister?: (tryoutId: string) => void;
}

const TryoutCard: React.FC<TryoutCardProps> = ({ tryout, onRegister }) => {
  const registrationOpen = isRegistrationOpen(tryout.registrationDeadline);
  const spotsAvailable = tryout.maxParticipants - tryout.currentParticipants;
  const fillPercentage = (tryout.currentParticipants / tryout.maxParticipants) * 100;

  const handleRegister = () => {
    if (onRegister) {
      onRegister(tryout.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img 
          src={tryout.imageUrl} 
          alt={tryout.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          {tryout.isActive ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle size={12} className="mr-1" />
              Ativa
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle size={12} className="mr-1" />
              Encerrada
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {tryout.club}
          </span>
        </div>
      </div>

      <CardBody className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{tryout.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{tryout.description}</p>
        </div>

        {/* Date and Time */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-primary-500" />
            <span>{formatDate(tryout.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 text-primary-500" />
            <span>{tryout.time}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start text-sm">
          <MapPin size={16} className="mr-2 mt-0.5 text-primary-500 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900">{tryout.location}</div>
            <div className="text-gray-600">{tryout.address}</div>
          </div>
        </div>

        {/* Age Range and Positions */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Users size={16} className="mr-2 text-primary-500" />
            <span className="text-gray-600">Idade: </span>
            <span className="font-medium text-gray-900 ml-1">{tryout.ageRange}</span>
          </div>
          <div className="flex items-center text-sm">
            <Target size={16} className="mr-2 text-primary-500" />
            <span className="text-gray-600">Posições: </span>
            <div className="ml-1 flex flex-wrap gap-1">
              {tryout.positions.map((position, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {getPositionLabel(position)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Participants Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Vagas preenchidas</span>
            <span className="font-medium text-gray-900">
              {tryout.currentParticipants}/{tryout.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                fillPercentage >= 90 ? 'bg-red-500' : 
                fillPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {spotsAvailable > 0 ? `${spotsAvailable} vagas disponíveis` : 'Vagas esgotadas'}
          </div>
        </div>

        {/* Cost */}
        <div className="flex items-center text-sm">
          <DollarSign size={16} className="mr-2 text-primary-500" />
          <span className="text-gray-600">Taxa: </span>
          <span className={`font-medium ml-1 ${tryout.cost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {tryout.cost === 0 ? 'Gratuita' : `R$ ${tryout.cost.toFixed(2)}`}
          </span>
        </div>

        {/* Contact */}
        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Contato</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center">
              <Phone size={12} className="mr-2" />
              <span>{tryout.contact.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail size={12} className="mr-2" />
              <span>{tryout.contact.email}</span>
            </div>
          </div>
        </div>

        {/* Registration Status and Button */}
        <div className="border-t pt-4">
          {!registrationOpen ? (
            <div className="text-center">
              <div className="text-sm text-red-600 mb-2">
                Inscrições encerradas em {formatDate(tryout.registrationDeadline)}
              </div>
              <Button variant="outline" disabled fullWidth>
                Inscrições Encerradas
              </Button>
            </div>
          ) : spotsAvailable === 0 ? (
            <div className="text-center">
              <div className="text-sm text-orange-600 mb-2">
                Vagas esgotadas
              </div>
              <Button variant="outline" disabled fullWidth>
                Vagas Esgotadas
              </Button>
            </div>
          ) : !tryout.isActive ? (
            <Button variant="outline" disabled fullWidth>
              Peneira Encerrada
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 text-center">
                Inscrições até {formatDate(tryout.registrationDeadline)}
              </div>
              <Button 
                variant="primary" 
                fullWidth
                onClick={handleRegister}
                rightIcon={<ExternalLink size={16} />}
              >
                Inscrever-se
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default TryoutCard;