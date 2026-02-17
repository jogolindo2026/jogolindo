import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Camera, Save, Mail, Phone, Ruler, MapPin, User, Calendar, Weight, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { user: currentUser, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  
  const isOwnProfile = !id || id === currentUser?.id;
  const isAtleta = currentUser?.role === 'atleta';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    birth_date: '', // 🛡️ Sincronizado com o padrão do banco
    city: '',
    position: '',
    company: '',
    height: '',
    weight: '',
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (currentUser && isOwnProfile) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || '',
        birth_date: currentUser.birth_date || '', // 🛡️ Corrigido para birth_date
        city: currentUser.city || '',
        position: currentUser.position || '',
        company: currentUser.company || '',
        height: currentUser.height?.toString() || '',
        weight: currentUser.weight?.toString() || '',
      });
    }
  }, [currentUser, isOwnProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = { 
      name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      birth_date: formData.birth_date, // 🛡️ Enviando como birth_date
      city: formData.city,
      position: formData.position,
      company: formData.company,
      height: formData.height ? parseInt(formData.height) : null,
      weight: formData.weight ? parseInt(formData.weight) : null
    };

    if (previewImage) updateData.profile_picture = previewImage; // 🛡️ Corrigido para profile_picture

    await updateProfile(updateData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-montserrat text-left">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <Card className="border-t-4 border-green-600">
              <CardBody className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    // 🛡️ Corrigido para ler profile_picture
                    src={previewImage || currentUser?.profile_picture || `https://ui-avatars.com/api/?name=${formData.name}&background=0A5F38&color=fff`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                    alt="Foto"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer">
                      <Camera size={18} />
                      <input type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setPreviewImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  )}
                </div>
                <h2 className="text-2xl font-bold uppercase">{formData.name || 'Usuário'}</h2>
                <p className="text-green-700 font-bold mb-6 uppercase italic text-sm">{currentUser?.role}</p>
                <div className="space-y-4 border-t pt-6 text-sm">
                  <div className="flex items-center gap-3"><Mail size={16} /> {currentUser?.email}</div>
                  <div className="flex items-center gap-3"><Phone size={16} /> {formData.phone || 'Adicionar telefone'}</div>
                  <div className="flex items-center gap-3"><MapPin size={16} /> {formData.city || 'Adicionar cidade'}</div>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setIsEditing(!isEditing)} fullWidth className="mt-8 font-bold">
                    {isEditing ? 'CANCELAR' : 'EDITAR PERFIL'}
                  </Button>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader><h3 className="font-bold uppercase italic">{isAtleta ? 'Ficha Técnica' : 'Dados Profissionais'}</h3></CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</label>
                      <input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 outline-none bg-transparent font-bold" />
                    </div>
                    {isAtleta ? (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Posição</label>
                          <select name="position" value={formData.position} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 outline-none bg-transparent font-bold">
                            <option value="">Selecione</option>
                            <option value="goleiro">Goleiro</option>
                            <option value="zagueiro">Zagueiro</option>
                            <option value="meio">Meio-Campo</option>
                            <option value="atacante">Atacante</option>
                          </select>
                        </div>
                        {/* 🛡️ Nome do input corrigido para birth_date */}
                        <div><label className="text-[10px] font-bold text-gray-400 uppercase flex gap-1"><Calendar size={10}/> Nascimento</label><input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 bg-transparent font-bold" /></div>
                        <div><label className="text-[10px] font-bold text-gray-400 uppercase flex gap-1"><Ruler size={10}/> Altura (cm)</label><input type="number" name="height" value={formData.height} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 bg-transparent font-bold" /></div>
                      </>
                    ) : (
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex gap-1"><Briefcase size={10}/> Clube ou Empresa</label>
                        <input name="company" value={formData.company} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 font-bold bg-transparent" />
                      </div>
                    )}
                  </div>
                  {isEditing && <div className="flex justify-end pt-4"><Button type="submit" className="px-10 font-bold uppercase italic">SALVAR FICHA</Button></div>}
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;